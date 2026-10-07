import { useEffect, useReducer, useRef } from 'react'
import {
  ADVANCE_MS, AMBASSADOR_COST_MULT, BETTING_MS, DEFAULT_STAKE, modeFor, RESULT_MS, REVEAL_MAX_MS, START_BALANCE,
  type Color,
} from './config'
import { roundInfo } from './scenes'

export type Phase = 'betting' | 'reveal' | 'result' | 'advancing'

export interface Bet {
  color: Color
  stake: number
  mult: number // multiplier of the picked color at lock time
}

export interface Outcome {
  result: Color
  resultMult: number // multiplier of the revealed color in that round's mode
  bet: Bet
  payout: number // 0 on loss
}

export interface GameState {
  round: number
  phase: Phase
  elapsed: number
  pick: Color | null
  bet: Bet | null
  outcome: Outcome | null
  balance: number
  stake: number
  history: Outcome[] // played rounds only, newest first
  ambassador: string | null // model id
  highRisk: boolean
  autoBet: boolean
}

type Action =
  | { type: 'tick'; dt: number }
  | { type: 'pick'; color: Color }
  | { type: 'setStake'; stake: number }
  | { type: 'next' }
  | { type: 'resetBalance' }
  | { type: 'setAmbassador'; id: string | null }
  | { type: 'setHighRisk'; on: boolean }
  | { type: 'setAutoBet'; on: boolean }
  | { type: 'revealEnded' }

const HISTORY_LIMIT = 50

const round2 = (n: number) => Math.round(n * 100) / 100

export const phaseDuration = (s: GameState) => {
  switch (s.phase) {
    case 'betting': return BETTING_MS
    case 'reveal': return REVEAL_MAX_MS
    case 'result': return RESULT_MS
    case 'advancing': return ADVANCE_MS
  }
}

// Amount actually placed for the current stake (higher when playing with an ambassador)
export const betCost = (s: Pick<GameState, 'stake' | 'ambassador'>) =>
  round2(s.stake * (s.ambassador ? AMBASSADOR_COST_MULT : 1))

// End of betting time. The picked color becomes the bet and is charged once; with no pick
// (or not enough balance) the round is skipped: no reveal, no charge, straight to the next scene.
function lockIn(s: GameState): GameState {
  const cost = betCost(s)
  if (s.pick === null || cost <= 0 || cost > s.balance) {
    return { ...s, phase: 'advancing', elapsed: 0, pick: null, bet: null }
  }
  const bet = { color: s.pick, stake: cost, mult: modeFor(s.highRisk).multipliers[s.pick] }
  return { ...s, phase: 'reveal', elapsed: 0, bet, balance: round2(s.balance - cost) }
}

function settle(s: GameState): GameState {
  if (!s.bet) return { ...s, phase: 'advancing', elapsed: 0 }
  const result = roundInfo(s.round, s.ambassador, s.highRisk).result
  const payout = s.bet.color === result ? round2(s.bet.stake * s.bet.mult) : 0
  const outcome = { result, resultMult: modeFor(s.highRisk).multipliers[result], bet: s.bet, payout }
  return {
    ...s,
    phase: 'result',
    elapsed: 0,
    outcome,
    balance: round2(s.balance + payout),
    history: [outcome, ...s.history].slice(0, HISTORY_LIMIT),
  }
}

function advance(s: GameState): GameState {
  return { ...s, phase: 'advancing', elapsed: 0 }
}

// Auto bet: each new round starts with the color of the last bet already picked (still switchable)
const autoPick = (s: GameState): Color | null => (s.autoBet ? s.history[0]?.bet.color ?? null : null)

function nextRound(s: GameState): GameState {
  return {
    ...s,
    round: s.round + 1,
    phase: 'betting',
    elapsed: 0,
    pick: autoPick(s),
    bet: null,
    outcome: null,
    stake: Math.min(s.stake, Math.max(1, Math.floor(s.balance))),
  }
}

function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'tick': {
      const next = { ...s, elapsed: s.elapsed + a.dt }
      if (next.elapsed < phaseDuration(s)) return next
      switch (s.phase) {
        case 'betting': return lockIn(s)
        case 'reveal': return settle(s)
        case 'result': return advance(s)
        case 'advancing': return nextRound(s)
      }
      return next
    }
    case 'pick':
      // Switchable until the timer locks it
      if (s.phase !== 'betting') return s
      return { ...s, pick: s.pick === a.color ? null : a.color }
    case 'setStake':
      if (s.phase === 'reveal') return s
      return { ...s, stake: Math.max(1, Math.floor(a.stake)) }
    case 'next':
      return s.phase === 'result' ? advance(s) : s
    case 'revealEnded':
      return s.phase === 'reveal' ? settle(s) : s
    case 'resetBalance':
      return { ...s, balance: START_BALANCE }
    case 'setHighRisk':
      // Betting controls are locked while a reveal plays
      return s.phase === 'reveal' ? s : { ...s, highRisk: a.on }
    case 'setAutoBet': {
      const next = { ...s, autoBet: a.on }
      return a.on && s.phase === 'betting' && s.pick === null ? { ...next, pick: autoPick(next) } : next
    }
    case 'setAmbassador':
      // Switch right away if the round hasn't been played yet; otherwise from the next round
      return s.phase === 'betting'
        ? { ...s, ambassador: a.id, elapsed: 0, pick: autoPick(s) }
        : { ...s, ambassador: a.id }
  }
}

export interface SessionStats {
  rounds: number
  totalWon: number
  biggestWin: number
  wins: number
}

export const sessionStats = (history: Outcome[]): SessionStats => ({
  rounds: history.length,
  totalWon: round2(history.reduce((sum, o) => sum + o.payout, 0)),
  biggestWin: history.reduce((max, o) => Math.max(max, o.payout), 0),
  wins: history.filter(o => o.payout > 0).length,
})

const STORAGE_KEY = 'hotswipe.balance'

function loadBalance() {
  try {
    const v = Number(localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(v) && v > 0 ? v : START_BALANCE
  } catch {
    return START_BALANCE
  }
}

export function useGame(paused: boolean) {
  const [state, dispatch] = useReducer(reducer, undefined, (): GameState => ({
    round: 0,
    phase: 'betting',
    elapsed: 0,
    pick: null,
    bet: null,
    outcome: null,
    balance: loadBalance(),
    stake: DEFAULT_STAKE,
    history: [],
    ambassador: null,
    highRisk: false,
    autoBet: false,
  }))

  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      // Clamp dt so a backgrounded tab doesn't skip whole phases
      const dt = Math.min(now - last, 100)
      last = now
      if (!pausedRef.current) dispatch({ type: 'tick', dt })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Dev hook: lets tests drive the clock, e.g. __hotswipe({ type: 'tick', dt: 1000 })
  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__hotswipe = dispatch
  }, [])

  useEffect(() => {
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__hotswipeState = state
  }, [state])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(state.balance)) } catch { /* storage unavailable */ }
  }, [state.balance])

  return { state, dispatch }
}
