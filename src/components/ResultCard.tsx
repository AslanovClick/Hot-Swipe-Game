import { useEffect, useState } from 'react'
import { COLOR_LABEL } from '../game/config'
import type { Outcome } from '../game/useGame'
import { formatCoins } from './Header'
import { CoinIcon, HeartSolid } from './icons'

// Deterministic pseudo-random in [0, 1) for particle layouts
const rand = (i: number, n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1

export function ResultCard({ outcome, leaving, animate }: { outcome: Outcome; leaving: boolean; animate: boolean }) {
  const { bet, result, payout } = outcome
  const won = payout > 0

  return (
    <div className={`result ${won ? 'is-win' : 'is-lose'} ${leaving ? 'is-leaving' : ''}`}>
      <div className="result-glow" />
      {won && <div className="win-flash" />}
      {won && <FloatingHearts />}

      <div className="result-body">
        {won ? (
          <>
            <div className="win-rays" aria-hidden />
            <div className="win-ring" aria-hidden />
            <Burst />
            <Sparkles />
            <div className="win-title" aria-label="You win!">
              {/* Letters drop in one by one; the light streak then rolls across them as a wave */}
              {[...'You win!'].map((ch, i) => (
                <span key={i} className="win-letter" style={{ ['--i' as string]: i }} aria-hidden>
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </div>
            <div className="win-mult">x{bet.mult.toFixed(2)}</div>
            <div className="win-payout glass">
              <CoinIcon size={20} /> <CountUp value={payout} animate={animate} />
            </div>
          </>
        ) : (
          <>
            <div className="lose-title">Try again!</div>
            <div className="result-sub">
              It was <b className={`result-color text-${result}`}>{COLOR_LABEL[result]}</b>
              <span className="result-loss">−{formatCoins(bet.stake)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Coins and hearts thrown out from the title at the moment of the win, falling away as they fade
const BURST = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + rand(i, 11) * 0.35
  const dist = 110 + rand(i, 12) * 90
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist * 0.75,
    spin: (rand(i, 13) - 0.5) * 540,
    size: 14 + rand(i, 14) * 12,
    delay: rand(i, 15) * 120,
    coin: i % 3 !== 0,
  }
})

function Burst() {
  return (
    <div className="burst" aria-hidden>
      {BURST.map((b, i) => (
        <span
          key={i}
          className={`burst-bit ${b.coin ? 'is-coin' : 'is-heart'}`}
          style={{
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}ms`,
            ['--dx' as string]: `${b.dx}px`,
            ['--dy' as string]: `${b.dy}px`,
            ['--spin' as string]: `${b.spin}deg`,
          }}
        >
          {b.coin ? null : <HeartSolid size={Math.round(b.size)} />}
        </span>
      ))}
    </div>
  )
}

// Payout counts up from zero once the payout pill has risen in
function CountUp({ value, animate }: { value: number; animate: boolean }) {
  const [shown, setShown] = useState(animate ? 0 : value)
  useEffect(() => {
    if (!animate) return setShown(value)
    const DELAY = 450, DURATION = 900
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start - DELAY) / DURATION))
      setShown(value * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    // Lands on the exact amount even where animation frames are throttled
    const done = setTimeout(() => setShown(value), DELAY + DURATION + 50)
    return () => { cancelAnimationFrame(raf); clearTimeout(done) }
  }, [value, animate])
  return <span className="win-payout-value">+{formatCoins(shown)}</span>
}

// Four-point glints twinkling around the title; positions are fixed so they frame the text
const SPARKLES = [
  { x: -8, y: 8, s: 18, d: 300 }, { x: 104, y: 14, s: 22, d: 520 }, { x: 12, y: -14, s: 12, d: 760 },
  { x: 88, y: -10, s: 14, d: 420 }, { x: -14, y: 58, s: 12, d: 900 }, { x: 110, y: 62, s: 16, d: 640 },
  { x: 30, y: -22, s: 10, d: 1100 }, { x: 70, y: -20, s: 12, d: 980 }, { x: 2, y: 90, s: 14, d: 1250 },
  { x: 98, y: 92, s: 12, d: 1180 }, { x: 50, y: -28, s: 16, d: 820 }, { x: 118, y: 36, s: 10, d: 1400 },
]

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden>
      {SPARKLES.map((p, i) => (
        <svg
          key={i}
          className={`sparkle ${i % 3 === 0 ? 'is-gold' : ''}`}
          width={p.s}
          height={p.s}
          viewBox="0 0 24 24"
          style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.d}ms` }}
        >
          <path d="M12 0c.9 6.3 5.7 11.1 12 12-6.3.9-11.1 5.7-12 12-.9-6.3-5.7-11.1-12-12C6.3 11.1 11.1 6.3 12 0z" fill="currentColor" />
        </svg>
      ))}
    </div>
  )
}

// Hearts are weighted to the screen edges so they frame the result instead of covering it.
// Outer span rises (vertical only), inner span sways — two independent smooth motions.

const HEARTS = Array.from({ length: 32 }, (_, i) => {
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
