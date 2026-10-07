import { useEffect, useRef, useState } from 'react'
import { COLOR_LABEL } from '../game/config'
import type { Outcome } from '../game/useGame'
import { GearIcon, HeartIcon, HistoryIcon, InfoIcon, LockIcon, WalletIcon } from './icons'

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
  history: Outcome[]
  ambassador: string | null
  onMenu: () => void
  onInfo: () => void
  onAmbassadors: () => void
  onHistory: () => void
}

export function Header({ balance, delta, history, ambassador, onMenu, onInfo, onAmbassadors, onHistory }: Props) {
  const shown = useTweened(balance)
  const ref = useRef<HTMLElement>(null)

  // The header floats over the full-screen scene; overlays below it read its height
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => el.parentElement?.style.setProperty('--header-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <header className="header" ref={ref}>
      <div className="header-top">
        <div className="logo" aria-label="Hot Swipe">
          <span>Hot</span>
          <span>Swipe<HeartIcon size={14} /></span>
        </div>

        <div className="header-actions">
          <button className="hbtn" onClick={onInfo} aria-label="How to play"><InfoIcon /></button>
          <div className="hbtn balance" aria-label="Balance">
            <WalletIcon />
            <span className="balance-value">{formatCoins(shown)}</span>
            {delta !== null && delta > 0 && (
              <span key={delta} className="balance-delta">+{formatCoins(delta)}</span>
            )}
          </div>
          {ambassador ? (
            <button className="hbtn ambassadors is-locked" onClick={onAmbassadors} aria-label="Change ambassador" title="Change ambassador">
              <LockIcon />
            </button>
          ) : (
            <button className="hbtn ambassadors" onClick={onAmbassadors} aria-label="Ambassadors" title="Ambassadors">
              <HeartIcon size={20} />
            </button>
          )}
          <button className="hbtn" onClick={onMenu} aria-label="Settings"><GearIcon /></button>
        </div>
      </div>

      <HistoryStrip history={history} onOpen={onHistory} />
    </header>
  )
}

// Played rounds only. Won: chip filled with the color that was bet on. Lost: outlined in the color that won.
function HistoryStrip({ history, onOpen }: { history: Outcome[]; onOpen: () => void }) {
  return (
    <div className="history">
      <div className="history-chips">
        <span className="hchip is-current" aria-label="Current round">?</span>
        {history.map((o, i) => {
          const kind = o.payout > 0 ? 'win' : 'lose'
          return (
            <span
              key={history.length - i}
              className={`hchip is-${kind} c-${o.result}`}
              title={`${COLOR_LABEL[o.result]} · ${kind === 'win' ? 'won' : 'lost'}`}
            >
              {o.resultMult.toFixed(2)}
            </span>
          )
        })}
      </div>
      <button className="history-btn" onClick={onOpen} aria-label="Round history"><HistoryIcon /></button>
    </div>
  )
}
