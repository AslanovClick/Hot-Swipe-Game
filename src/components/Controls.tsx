import { useEffect, useRef, type ReactNode } from 'react'
import { AMBASSADOR_COST_MULT, BETTING_MS, COLOR_LABEL, COLORS, modeFor, STAKE_STEPS, type Color } from '../game/config'
import { MODELS } from '../game/scenes'
import { betCost, type GameState } from '../game/useGame'
import { ModelInfo } from './Feed'
import { formatCoins } from './Header'
import { BoltIcon, CheckIcon, ClockIcon, HeartIcon, LockSmallIcon, RepeatIcon } from './icons'

export const stepStake = (stake: number, dir: 1 | -1, max: number) => {
  const next = dir > 0
    ? STAKE_STEPS.find(v => v > stake) ?? stake
    : [...STAKE_STEPS].reverse().find(v => v < stake) ?? STAKE_STEPS[0]
  return Math.max(1, Math.min(next, Math.max(1, Math.floor(max))))
}

// Model row above the dock: name on the left, selected ambassador badge on the right
export function SceneHud({ state }: { state: GameState }) {
  const ambassador = state.ambassador ? MODELS.find(m => m.id === state.ambassador) : null

  return (
    <div className="scene-model">
      <ModelInfo round={state.round} phase={state.phase} ambassador={state.ambassador} />
      {ambassador && (
        <span className="amb-badge">
          <span className="amb-badge-photo"><video src={ambassador.poster} muted playsInline preload="metadata" /></span>
          <span className="amb-badge-text">
            <b><HeartIcon size={12} /> {ambassador.name}</b>
            <small>Bet ×{AMBASSADOR_COST_MULT}</small>
          </span>
        </span>
      )}
    </div>
  )
}

interface Props {
  state: GameState
  onPick: (c: Color) => void
  onStake: (stake: number) => void
  onHighRisk: (on: boolean) => void
  onAutoBet: (on: boolean) => void
}

export function BetPanel({ state, onPick, onStake, onHighRisk, onAutoBet }: Props) {
  const { phase, pick, outcome, stake, balance, bet, highRisk, autoBet } = state
  const betting = phase === 'betting'
  const revealing = phase === 'reveal'
  const shownResult = phase === 'result' ? outcome?.result ?? null : null
  const lockedColor = bet?.color ?? null
  const cost = betCost(state)
  const mults = modeFor(highRisk).multipliers
  const remaining = betting ? Math.max(0, BETTING_MS - state.elapsed) : 0
  const urgent = betting && remaining < 1500
  const ref = useRef<HTMLDivElement>(null)

  // Exposes the dock height so scene overlays (model name, result text) sit right above it
  useEffect(() => {
    const el = ref.current?.closest<HTMLElement>('.dock')
    if (!el) return
    const ro = new ResizeObserver(() => el.parentElement?.style.setProperty('--dock-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="panel" ref={ref}>
      {/* Betting countdown lives in the panel so it never covers the model */}
      <div className={`panel-timer ${betting ? '' : 'is-hidden'} ${urgent ? 'is-urgent' : ''}`} aria-label="Time to bet">
        <span className="panel-timer-num"><ClockIcon size={15} /> 0:0{Math.ceil(remaining / 1000)}</span>
        <span className="panel-timer-bar">
          <span style={{ transform: `scaleX(${remaining / BETTING_MS})` }} />
        </span>
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
        <div className="block toggles">
          <Switch icon={<RepeatIcon size={14} />} label="Auto bet" checked={autoBet} onChange={onAutoBet} />
          <Switch
            icon={<BoltIcon size={14} />}
            label="High risk"
            checked={highRisk}
            onChange={onHighRisk}
            disabled={revealing}
            tone="gold"
          />
        </div>

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
      </div>
    </div>
  )
}

interface SwitchProps {
  icon: ReactNode
  label: string
  checked: boolean
  onChange: (on: boolean) => void
  disabled?: boolean
  tone?: 'pink' | 'gold'
}

function Switch({ icon, label, checked, onChange, disabled, tone = 'pink' }: SwitchProps) {
  return (
    <label className={`switch tone-${tone} ${checked ? 'is-on' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange(e.target.checked)} />
      <span className="switch-icon">{icon}</span>
      <span className="switch-label">{label}</span>
      <span className="toggle-track"><span className="toggle-knob" /></span>
    </label>
  )
}
