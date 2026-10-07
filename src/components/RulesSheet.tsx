import { AMBASSADOR_COST_MULT, BETTING_MS, COLOR_LABEL, COLORS, HIGH_RISK_MODE, NORMAL_MODE } from '../game/config'
import { CloseIcon } from './icons'

export function RulesSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet rules" onClick={e => e.stopPropagation()} role="dialog" aria-label="How to play">
        <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        <div className="sheet-title">How to play</div>

        <ol className="rules-list">
          <li>Guess the color of her lingerie. You have {BETTING_MS / 1000} seconds.</li>
          <li>Tap a color to bet. You can switch until time is up — then the bet locks and is charged once.</li>
          <li>The scene reveals the color. Guess right and win your bet × the multiplier.</li>
          <li>No pick? The round is skipped: nothing is charged and the next model swipes in.</li>
        </ol>

        <div className="rules-mode">Standard</div>
        <div className="rules-mults">
          {COLORS.map(c => (
            <div key={c} className={`rules-mult color-${c}`}>
              <span>{COLOR_LABEL[c]}</span>
              <b>×{NORMAL_MODE.multipliers[c].toFixed(2)}</b>
            </div>
          ))}
        </div>
        <div className="rules-mode">High risk</div>
        <div className="rules-mults">
          {COLORS.map(c => (
            <div key={c} className={`rules-mult color-${c}`}>
              <span>{COLOR_LABEL[c]}</span>
              <b>×{HIGH_RISK_MODE.multipliers[c].toFixed(2)}</b>
            </div>
          ))}
        </div>

        <p className="rules-note">
          Ambassador mode: bet ×{AMBASSADOR_COST_MULT}. Virtual coins only — no real money involved.
        </p>

        <button className="cta menu-close" onClick={onClose}><span className="cta-label">Got it</span></button>
      </div>
    </div>
  )
}
