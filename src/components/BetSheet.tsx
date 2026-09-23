import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { STAKE_STEPS } from '../game/config'
import { formatCoins } from './Header'
import { CoinIcon } from './icons'

interface Props {
  stake: number
  balance: number
  onApply: (stake: number) => void
  onClose: () => void
}

const ITEM_W = 64

export function BetSheet({ stake, balance, onApply, onClose }: Props) {
  const cap = Math.max(1, Math.min(Math.floor(balance), STAKE_STEPS[STAKE_STEPS.length - 1]))

  // Ascending strip: presets that fit the balance, plus the exact cap and current stake
  const options = useMemo(() => {
    const set = new Set([...STAKE_STEPS.filter(v => v <= cap), cap])
    if (stake <= cap) set.add(stake)
    return [...set].sort((a, b) => a - b)
  }, [cap, stake])

  const [draft, setDraft] = useState(Math.min(stake, cap))
  const listRef = useRef<HTMLDivElement>(null)
  const fromScroll = useRef(false)
  const index = Math.max(0, options.indexOf(draft))

  useLayoutEffect(() => {
    listRef.current?.scrollTo({ left: index * ITEM_W, behavior: 'instant' })
    // Only on open; later moves are handled below
  }, [])

  // Button-driven changes (MIN/MAX/+/−/tap) visibly roll the wheel to the new value
  useEffect(() => {
    if (fromScroll.current) { fromScroll.current = false; return }
    const list = listRef.current
    if (list && Math.abs(list.scrollLeft - index * ITEM_W) > 1) {
      list.scrollTo({ left: index * ITEM_W, behavior: 'smooth' })
    }
  }, [index])

  const onScroll = () => {
    const list = listRef.current
    if (!list) return
    const i = Math.min(options.length - 1, Math.max(0, Math.round(list.scrollLeft / ITEM_W)))
    if (options[i] !== draft) {
      fromScroll.current = true
      setDraft(options[i])
    }
  }

  const go = (i: number) => setDraft(options[Math.min(options.length - 1, Math.max(0, i))])

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Bet size">
        <div className="sheet-handle" />
        <div className="sheet-title">Bet size</div>

        <div className="sheet-amount">
          <CoinIcon size={28} />
          <span key={draft}>{formatCoins(draft)}</span>
        </div>
        <div className="sheet-balance">Balance {formatCoins(balance)}</div>

        <div className="sheet-picker">
          <div className="sheet-side">
            <button className="glass side-btn" onClick={() => go(options.length - 1)}>MAX</button>
            <button className="glass side-btn" onClick={() => go(0)}>MIN</button>
          </div>

          <div className="wheel glass">
            <div className="wheel-highlight" />
            <div className="wheel-list" ref={listRef}
              onScroll={onScroll}
              onWheel={e => {
                // Desktop mouse wheel: map vertical scroll onto the horizontal strip
                if (listRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) listRef.current.scrollLeft += e.deltaY
              }}
            >
              {options.map((v, i) => (
                <button
                  key={v}
                  className={`wheel-item ${i === index ? 'is-active' : ''} ${Math.abs(i - index) === 1 ? 'is-near' : ''}`}
                  onClick={() => go(i)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="sheet-side">
            <button className="glass side-btn side-big" onClick={() => go(index + 1)} aria-label="Increase">+</button>
            <button className="glass side-btn side-big" onClick={() => go(index - 1)} aria-label="Decrease">−</button>
          </div>
        </div>

        <div className="sheet-actions">
          <button className="glass btn-ghost" onClick={onClose}>Cancel</button>
          <button className="cta" onClick={() => onApply(draft)}><span className="cta-label">OK</span></button>
        </div>
      </div>
    </div>
  )
}
