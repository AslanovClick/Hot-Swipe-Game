import { BETTING_MS, COLOR_LABEL, COLORS, MULTIPLIERS } from '../game/config'

export function RulesSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet rules" onClick={e => e.stopPropagation()} role="dialog" aria-label="How to play">
        <div className="sheet-handle" />
        <div className="sheet-title">How to play</div>

        <ol className="rules-list">
          <li>Guess the color of her sports top.</li>
          <li>Pick a color and set your bet — you have {BETTING_MS / 1000} seconds.</li>
          <li>Press Bet, or your pick is placed automatically when time runs out.</li>
          <li>The scene reveals the color. Guess right and win your bet × the multiplier.</li>
        </ol>

        <div className="rules-mults">
          {COLORS.map(c => (
            <div key={c} className={`rules-mult color-${c}`}>
              <span>{COLOR_LABEL[c]}</span>
              <b>×{MULTIPLIERS[c].toFixed(2)}</b>
            </div>
          ))}
        </div>

        <p className="rules-note">Virtual coins only — no real money involved.</p>

        <button className="cta menu-close" onClick={onClose}><span className="cta-label">Got it</span></button>
      </div>
    </div>
  )
}
