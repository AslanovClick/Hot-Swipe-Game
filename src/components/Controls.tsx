import { useEffect, useRef } from 'react'
import { AMBASSADOR_COST_MULT, BETTING_MS, COLOR_LABEL, COLORS, HIGH_RISK_MODE, modeFor, STAKE_STEPS, type Color } from '../game/config'
import { MODELS } from '../game/scenes'
import { betCost, type GameState } from '../game/useGame'
import { ModelInfo } from './Feed'
import { formatCoins } from './Header'
import { BoltIcon, CheckIcon, HeartIcon, LockSmallIcon } from './icons'

export const stepStake = (stake: number, dir: 1 | -1, max: number) => {
  const next = dir > 0
    ? STAKE_STEPS.find(v => v > stake) ?? stake
    : [...STAKE_STEPS].reverse().find(v => v < stake) ?? STAKE_STEPS[0]
  return Math.max(1, Math.min(next, Math.max(1, Math.floor(max))))
}

// Timer (top center) and model row (name on the left, ambassador badge on the right)
export function SceneHud({ state }: { state: GameState }) {
  const { phase } = state
  const betting = phase === 'betting'
  const remaining = betting ? Math.max(0, BETTING_MS - state.elapsed) : 0
  const urgent = betting && remaining < 1500
  const ambassador = state.ambassador ? MODELS.find(m => m.id === state.ambassador) : null

  return (
    <>
      <div className={`scene-timer ${betting ? '' : phase === 'reveal' ? 'is-reveal' : 'is-idle'}`}>
        <div className={`timer ${urgent ? 'is-urgent' : ''}`}>
          {phase === 'reveal'
            ? <span className="is-status">Revealing<span className="dots"><i>.</i><i>.</i><i>.</i></span></span>
            : `0:0${Math.ceil(remaining / 1000)}`}
        </div>
        <div className="timebar">
          <div
            className={`timebar-fill ${urgent ? 'is-urgent' : ''}`}
            style={{ transform: `scaleX(${betting ? remaining / BETTING_MS : 0})` }}
          />
        </div>
      </div>
      <div className="scene-model">
        <ModelInfo round={state.round} phase={phase} ambassador={state.ambassador} />
        {ambassador && (
          <span className="amb-badge">
            <span className="amb-badge-photo"><video src={ambassador.poster} muted playsInline preload="metadata" /></span>
            <span className="amb-badge-text">
              <b><HeartIcon size={11} /> {ambassador.name}</b>
              <small>Bet ×{AMBASSADOR_COST_MULT}</small>
            </span>
          </span>
        )}
      </div>
    </>
  )
}

interface Props {
  state: GameState
  onPick: (c: Color) => void
  onStake: (stake: number) => void
  onHighRisk: (on: boolean) => void
}

export function BetPanel({ state, onPick, onStake, onHighRisk }: Props) {
  const { phase, pick, outcome, stake, balance, bet, highRisk } = state
  const betting = phase === 'betting'
  const revealing = phase === 'reveal'
  const shownResult = phase === 'result' ? outcome?.result ?? null : null
  const lockedColor = bet?.color ?? null
  const cost = betCost(state)
  const broke = cost > balance
  const mults = modeFor(highRisk).multipliers
  const ref = useRef<HTMLDivElement>(null)

  // Exposes the dock height so scene overlays (model name, result text) sit right above it
  useEffect(() => {
    const el = ref.current?.closest<HTMLElement>('.dock')
    if (!el) return
    const ro = new ResizeObserver(() => el.parentElement?.style.setProperty('--dock-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const status = (() => {
    if (betting) {
      if (broke) return { text: 'Not enough balance for this bet', tone: 'warn' }
      if (pick) return { text: `${COLOR_LABEL[pick]} picked · locks when time is up`, tone: 'on' }
      return { text: 'Pick a color to bet', tone: '' }
    }
    if (bet && (revealing || phase === 'result')) {
      return { text: `Bet locked · ${COLOR_LABEL[bet.color]} · ${formatCoins(bet.stake)}`, tone: 'locked' }
    }
    return { text: 'No bet this round', tone: '' }
  })()

  return (
    <div className="panel" ref={ref}>
      <div className={`panel-status ${status.tone ? `is-${status.tone}` : ''}`} aria-live="polite">
        {status.tone === 'locked' && <LockSmallIcon />}
        <span>{status.text}</span>
      </div>

      <div className="colors" role="radiogroup" aria-label="Pick a color">
        {COLORS.map(c => {
          const selected = betting ? pick === c : lockedColor === c
          const dimmed = (betting && pick !== null && !selected) || (!betting && !selected && shownResult !== c)
          const isResult = shownResult === c
          return (
            <button
              key={c}
              role="radio"
              aria-checked={selected}
              className={[
                'color-btn', `color-${c}`,
                selected && 'is-selected',
                selected && !betting && 'is-locked',
                dimmed && 'is-dimmed',
                isResult && 'is-result',
                isResult && lockedColor === c && 'is-win',
              ].filter(Boolean).join(' ')}
              onClick={() => onPick(c)}
              disabled={!betting}
            >
              <span className="color-name">{COLOR_LABEL[c]}</span>
              <span key={mults[c]} className="color-mult">×{mults[c].toFixed(2)}</span>
              {selected && (
                <span className="check">{betting || isResult ? <CheckIcon size={11} /> : <LockSmallIcon size={10} />}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="panel-row">
        <div className="block bet-block">
          <button
            className="stake-step"
            onClick={() => onStake(stepStake(stake, -1, balance))}
            disabled={revealing}
            aria-label="Decrease bet"
          >−</button>
          <div className="stake">
            <span className="stake-label">{state.ambassador ? `Bet ×${AMBASSADOR_COST_MULT}` : 'Bet'}</span>
            <span key={cost} className="stake-value" aria-live="polite">{formatCoins(cost)}</span>
          </div>
          <button
            className="stake-step"
            onClick={() => onStake(stepStake(stake, 1, balance))}
            disabled={revealing}
            aria-label="Increase bet"
          >+</button>
        </div>

        <label className={`block risk ${highRisk ? 'is-on' : ''} ${revealing ? 'is-disabled' : ''}`}>
          <input
            type="checkbox"
            checked={highRisk}
            disabled={revealing}
            onChange={e => onHighRisk(e.target.checked)}
          />
          <span className="risk-icon"><BoltIcon size={16} /></span>
          <span className="risk-text">
            <b>High risk</b>
            <small>up to ×{HIGH_RISK_MODE.multipliers.white}</small>
          </span>
          <span className="toggle-track"><span className="toggle-knob" /></span>
        </label>
      </div>
    </div>
  )
}
