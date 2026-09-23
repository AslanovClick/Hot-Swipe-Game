import { useEffect, useRef } from 'react'
import { BETTING_MS, COLOR_LABEL, COLORS, MULTIPLIERS, STAKE_STEPS, type Color } from '../game/config'
import { betCost, phaseDuration, type GameState } from '../game/useGame'
import { ModelInfo } from './Feed'
import { formatCoins } from './Header'
import { CheckIcon, HeartIcon } from './icons'
import { Toggle } from './Toggle'

export const stepStake = (stake: number, dir: 1 | -1, max: number) => {
  const next = dir > 0
    ? STAKE_STEPS.find(v => v > stake) ?? stake
    : [...STAKE_STEPS].reverse().find(v => v < stake) ?? STAKE_STEPS[0]
  return Math.max(1, Math.min(next, Math.max(1, Math.floor(max))))
}

// Timer (top center of the scene) and model name (bottom left, above the dock)
export function SceneHud({ state }: { state: GameState }) {
  const { phase } = state
  const betting = phase === 'betting'
  const remaining = betting ? Math.max(0, BETTING_MS - state.elapsed) : 0
  const urgent = betting && remaining < 1500

  return (
    <>
      <div className={`scene-timer ${phase === 'result' || phase === 'advancing' ? 'is-idle' : ''} ${phase === 'reveal' ? 'is-reveal' : ''}`}>
        <div className={`timer ${urgent ? 'is-urgent' : ''}`}>
          {betting ? `0:0${Math.ceil(remaining / 1000)}` : phase === 'reveal'
            ? <span className="is-status">Revealing<span className="dots"><i>.</i><i>.</i><i>.</i></span></span>
            : '0:00'}
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
        {state.ambassador && (
          <span className="amb-chip"><HeartIcon size={14} /> Playing with ambassador</span>
        )}
      </div>
    </>
  )
}

interface Props {
  state: GameState
  onPick: (c: Color) => void
  onBet: () => void
  onNext: () => void
  onStake: (stake: number) => void
  onOpenStake: () => void
  toggles: { autoBet: boolean; highRisk: boolean }
  onToggle: (key: 'autoBet' | 'highRisk', value: boolean) => void
}

export function BetPanel({ state, onPick, onBet, onNext, onStake, onOpenStake, toggles, onToggle }: Props) {
  const { phase, pick, outcome, stake, balance, bet } = state
  const betting = phase === 'betting'
  const shownResult = phase === 'result' || phase === 'advancing' ? outcome?.result ?? null : null
  const locked = !betting
  const lockedColor = bet?.color ?? null
  const cost = betCost(state)
  const broke = cost > balance
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
      <div className="colors" role="radiogroup" aria-label="Pick a color">
        {COLORS.map(c => {
          const selected = betting ? pick === c : lockedColor === c
          const dimmed = (betting && pick !== null && !selected) || (locked && !selected && shownResult !== c)
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
              disabled={locked}
            >
              <span className="color-name">{COLOR_LABEL[c]}</span>
              <span className="color-mult">×{MULTIPLIERS[c].toFixed(2)}</span>
              {selected && <span className="check"><CheckIcon /></span>}
            </button>
          )
        })}
      </div>

      <div className="panel-row">
        <div className="block toggles">
          <Toggle label="Auto bet" checked={toggles.autoBet} onChange={v => onToggle('autoBet', v)} />
          <Toggle label="High risk" checked={toggles.highRisk} onChange={v => onToggle('highRisk', v)} />
        </div>

        <div className="block bet-block">
          <div className="stepper">
            <button
              className="stake-step"
              onClick={() => onStake(stepStake(stake, -1, balance))}
              disabled={locked}
              aria-label="Decrease bet"
            >−</button>
            <button className="stake-value" onClick={onOpenStake} aria-label="Change bet size">
              {formatCoins(stake)}
            </button>
            <button
              className="stake-step"
              onClick={() => onStake(stepStake(stake, 1, balance))}
              disabled={locked}
              aria-label="Increase bet"
            >+</button>
          </div>

          {phase === 'result' ? (
            <button className={`cta cta-next ${outcome && outcome.payout === 0 ? 'is-light' : ''}`} onClick={onNext}>
              <span
                className="cta-progress"
                style={{ transform: `scaleX(${Math.min(1, state.elapsed / phaseDuration(state))})` }}
              />
              <span className="cta-label">Play next</span>
            </button>
          ) : (
            <button className="cta" onClick={onBet} disabled={!betting || !pick || broke}>
              <span className="cta-label">
                {!betting
                  ? (bet ? 'Bet placed' : 'No bet')
                  : broke ? 'Low balance' : pick ? 'Bet' : 'Pick a color'}
              </span>
              {betting && pick && !broke && <span className="cta-sub">{formatCoins(cost)} coins</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
