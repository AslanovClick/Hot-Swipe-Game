import { useEffect, useReducer, useRef } from 'react'
import {
  ADVANCE_MS, BETTING_MS, DEFAULT_STAKE, MULTIPLIERS, RESULT_MS, RESULT_NO_BET_MS, REVEAL_MS, START_BALANCE,
  type Color,
} from './config'
import { sceneAt } from './scenes'

export type Phase = 'betting' | 'reveal' | 'result' | 'advancing'

export interface Bet {
  color: Color
  stake: number
}

export interface Outcome {
  result: Color
  bet: Bet | null
  payout: number // 0 on loss / no bet
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
  history: Outcome[] // newest first
}

type Action =
  | { type: 'tick'; dt: number }
  | { type: 'pick'; color: Color }
  | { type: 'placeBet' }
  | { type: 'setStake'; stake: number }
  | { type: 'next' }
  | { type: 'resetBalance' }

const HISTORY_LIMIT = 30

const round2 = (n: number) => Math.round(n * 100) / 100

export const phaseDuration = (s: GameState) => {
  switch (s.phase) {
    case 'betting': return BETTING_MS
    case 'reveal': return REVEAL_MS
    case 'result': return s.outcome?.bet ? RESULT_MS : RESULT_NO_BET_MS
    case 'advancing': return ADVANCE_MS
  }
}

// Closes betting: takes the stake off the balance if a color is picked, otherwise the round is watched without a bet
function lockIn(s: GameState): GameState {
  const canBet = s.pick !== null && s.stake > 0 && s.stake <= s.balance
  const bet = canBet ? { color: s.pick!, stake: s.stake } : null
  return {
    ...s,
    phase: 'reveal',
    elapsed: 0,
    bet,
    balance: bet ? round2(s.balance - bet.stake) : s.balance,
  }
}

function settle(s: GameState): GameState {
  const result = sceneAt(s.round).result
  const payout = s.bet && s.bet.color === result ? round2(s.bet.stake * MULTIPLIERS[result]) : 0
  return {
    ...s,
    phase: 'result',
    elapsed: 0,
    outcome: { result, bet: s.bet, payout },
    balance: round2(s.balance + payout),
    history: [{ result, bet: s.bet, payout }, ...s.history].slice(0, HISTORY_LIMIT),
  }
}

function advance(s: GameState): GameState {
  return { ...s, phase: 'advancing', elapsed: 0 }
}

function nextRound(s: GameState): GameState {
  return {
    ...s,
    round: s.round + 1,
    phase: 'betting',
    elapsed: 0,
    pick: null,
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
      if (s.phase !== 'betting') return s
      return { ...s, pick: s.pick === a.color ? null : a.color }
    case 'placeBet':
      if (s.phase !== 'betting' || !s.pick || s.stake > s.balance) return s
      return lockIn(s)
    case 'setStake':
      return { ...s, stake: Math.max(1, Math.floor(a.stake)) }
    case 'next':
      return s.phase === 'result' ? advance(s) : s
    case 'resetBalance':
      return { ...s, balance: START_BALANCE }
  }
}

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
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    round: 0,
    phase: 'betting' as Phase,
    elapsed: 0,
    pick: null,
    bet: null,
    outcome: null,
    balance: loadBalance(),
    stake: DEFAULT_STAKE,
    history: [],
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
    try { localStorage.setItem(STORAGE_KEY, String(state.balance)) } catch { /* storage unavailable */ }
  }, [state.balance])

  return { state, dispatch }
}
