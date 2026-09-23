import { COLOR_LABEL, MULTIPLIERS } from '../game/config'
import type { Outcome } from '../game/useGame'
import { formatCoins } from './Header'
import { CoinIcon, HeartSolid } from './icons'

export function ResultCard({ outcome, leaving }: { outcome: Outcome; leaving: boolean }) {
  const { bet, result, payout } = outcome
  const won = payout > 0
  const kind = won ? 'win' : bet ? 'lose' : 'skip'

  return (
    <div className={`result is-${kind} ${leaving ? 'is-leaving' : ''}`}>
      <div className="result-glow" />
      {won && <FloatingHearts />}

      <div className="result-body">
        {won ? (
          <>
            <div className="win-title">You win!</div>
            <div className="win-mult">x{MULTIPLIERS[result].toFixed(2)}</div>
            <div className="win-payout glass"><CoinIcon size={20} /> +{formatCoins(payout)}</div>
          </>
        ) : bet ? (
          <>
            <div className="lose-title">Try again!</div>
            <div className="result-sub">
              It was <b className="result-color">{COLOR_LABEL[result]}</b>
              <span className="result-loss">−{formatCoins(bet.stake)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="skip-label">It was</div>
            <div className={`skip-color text-${result}`}>{COLOR_LABEL[result]}</div>
            <div className="result-hint">No bet this round</div>
          </>
        )}
      </div>
    </div>
  )
}

// Hearts are weighted to the screen edges so they frame the result instead of covering it.
// Outer span rises (vertical only), inner span sways — two independent smooth motions.
const rand = (i: number, n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1

const HEARTS = Array.from({ length: 30 }, (_, i) => {
  const side = i % 5 === 4 ? 'mid' : i % 2 === 0 ? 'left' : 'right'
  const edge = rand(i, 1) * 20 // 0–20% in from the edge
  const left = side === 'left' ? edge : side === 'right' ? 100 - edge : 30 + rand(i, 1) * 40
  const mid = side === 'mid'
  return {
    left,
    size: (mid ? 10 : 14) + rand(i, 2) * (mid ? 14 : 30),
    delay: rand(i, 3) * 2600,
    duration: 3200 + rand(i, 4) * 2000,
    rise: mid ? 30 + rand(i, 5) * 15 : 60 + rand(i, 5) * 35, // vh
    // Side hearts lean outward, hugging the frame
    lean: side === 'left' ? -(6 + rand(i, 6) * 18) : side === 'right' ? 6 + rand(i, 6) * 18 : (rand(i, 6) - 0.5) * 16,
    sway: 8 + rand(i, 7) * 14,
    swayDur: 1400 + rand(i, 8) * 1000,
    blur: rand(i, 9) > 0.75,
    tone: rand(i, 10) > 0.55 ? 'a' : rand(i, 10) > 0.2 ? 'b' : 'c',
  }
})

function FloatingHearts() {
  return (
    <div className="hearts" aria-hidden>
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className={`heart tone-${h.tone} ${h.blur ? 'is-blur' : ''}`}
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}ms`,
            animationDuration: `${h.duration}ms`,
            ['--rise' as string]: `-${h.rise}vh`,
            ['--lean' as string]: `${h.lean}px`,
          }}
        >
          <span
            className="heart-sway"
            style={{
              animationDuration: `${h.swayDur}ms`,
              ['--sway' as string]: `${h.sway}px`,
            }}
          >
            <HeartSolid size={Math.round(h.size)} />
          </span>
        </span>
      ))}
    </div>
  )
}
