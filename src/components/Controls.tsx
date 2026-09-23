import { useEffect, useRef } from 'react'
import { BETTING_MS, COLOR_LABEL, COLORS, MULTIPLIERS, STAKE_STEPS, type Color } from '../game/config'
import { phaseDuration, type GameState } from '../game/useGame'
import { ModelInfo } from './Feed'
import { formatCoins } from './Header'
import { CheckIcon } from './icons'

interface Props {
  state: GameState
  onPick: (c: Color) => void
  onBet: () => void
  onNext: () => void
  onStake: (stake: number) => void
  onOpenStake: () => void
}

export const stepStake = (stake: number, dir: 1 | -1, max: number) => {
  const next = dir > 0
    ? STAKE_STEPS.find(v => v > stake) ?? stake
    : [...STAKE_STEPS].reverse().find(v => v < stake) ?? STAKE_STEPS[0]
  return Math.max(1, Math.min(next, Math.max(1, Math.floor(max))))
}

export function Controls({ state, onPick, onBet, onNext, onStake, onOpenStake }: Props) {
  const { phase, pick, outcome, stake, balance, bet } = state
  const betting = phase === 'betting'
  const remaining = betting ? Math.max(0, BETTING_MS - state.elapsed) : 0
  const secs = Math.ceil(remaining / 1000)
  const urgent = betting && remaining < 1500
  const shownResult = phase === 'result' || phase === 'advancing' ? outcome?.result ?? null : null
  const locked = !betting
  const lockedColor = bet?.color ?? null
  const broke = stake > balance
  const ref = useRef<HTMLDivElement>(null)

  // Exposes the panel height so overlays (result text) can sit right above the model name
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => el.parentElement?.style.setProperty('--controls-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="controls" ref={ref}>
      <div className="info-row">
        <ModelInfo round={state.round} phase={phase} />
        {betting ? (
          <div className={`timer ${urgent ? 'is-urgent' : ''}`}>0:0{secs}</div>
        ) : phase === 'reveal' ? (
          <div className="timer is-status">Revealing<span className="dots"><i>.</i><i>.</i><i>.</i></span></div>
        ) : null}
      </div>

      <div className="timebar">
        <div
          className={`timebar-fill ${urgent ? 'is-urgent' : ''}`}
          style={{ transform: `scaleX(${betting ? remaining / BETTING_MS : 0})` }}
        />
      </div>

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
              <span className="mult glass">×{MULTIPLIERS[c].toFixed(2)}</span>
              <span className="color-face">
                {COLOR_LABEL[c]}
                {selected && <span className="check"><CheckIcon /></span>}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bet-row">
        <div className="stake glass">
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
            <span className="cta-label">Play Next</span>
          </button>
        ) : (
          <button
            className="cta"
            onClick={onBet}
            disabled={!betting || !pick || broke}
          >
            <span className="cta-label">
              {!betting ? (bet ? 'Bet placed' : 'No bet') : broke ? 'Low balance' : pick ? 'Bet' : 'Pick a color'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
