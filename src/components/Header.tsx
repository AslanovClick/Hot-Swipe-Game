import { useEffect, useRef, useState } from 'react'
import { BurgerIcon, CoinIcon, HeartIcon } from './icons'

export const formatCoins = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function useTweened(target: number, ms = 700) {
  const [value, setValue] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      const v = a + (target - a) * (1 - Math.pow(1 - t, 3))
      from.current = v
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return value
}

interface Props {
  balance: number
  delta: number | null
  onMenu: () => void
}

export function Header({ balance, delta, onMenu }: Props) {
  const shown = useTweened(balance)
  return (
    <header className="header">
      <button className="glass icon-btn" onClick={onMenu} aria-label="Menu">
        <BurgerIcon />
      </button>

      <div className="balance glass" aria-label="Balance">
        <CoinIcon size={22} />
        <span className="balance-value">{formatCoins(shown)}</span>
        {delta !== null && delta > 0 && (
          <span key={delta} className="balance-delta">+{formatCoins(delta)}</span>
        )}
      </div>

      <button className="icon-btn ambassadors" aria-label="Ambassadors" title="Ambassadors">
        <HeartIcon size={20} />
      </button>
    </header>
  )
}
