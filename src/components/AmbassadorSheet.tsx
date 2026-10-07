import { useState } from 'react'
import { AMBASSADOR_COST_MULT } from '../game/config'
import { MODELS, type Model } from '../game/scenes'
import { formatCoins } from './Header'
import { CloseIcon, Flag, HeartIcon, VerifiedIcon } from './icons'

interface Props {
  current: string | null
  stake: number
  onSelect: (id: string | null) => void
  onClose: () => void
}

const COUNTRY: Record<Model['country'], string> = { es: 'Spain', us: 'USA', gb: 'UK' }

export function AmbassadorSheet({ current, stake, onSelect, onClose }: Props) {
  const [confirm, setConfirm] = useState<Model | null>(null)

  // The cost notice is shown when the mode is switched on; switching between ambassadors skips it
  const choose = (m: Model) => (current ? onSelect(m.id) : setConfirm(m))

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      {confirm ? (
        <div key="confirm" className="sheet amb-confirm" onClick={e => e.stopPropagation()} role="dialog" aria-label="Play with ambassador">
          <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          <div className="amb-confirm-avatar">
            <video src={confirm.poster} muted playsInline preload="metadata" />
            <span className="amb-confirm-heart"><HeartIcon size={14} /></span>
          </div>
          <div className="sheet-title">Play with {confirm.name}</div>
          <p className="amb-confirm-note">
            Ambassador mode raises the cost of each round. The new bet applies to every round until you turn the mode off.
          </p>

          <div className="amb-cost">
            <div className="amb-cost-col">
              <span>Standard bet</span>
              <b>{formatCoins(stake)}</b>
            </div>
            <span className="amb-cost-arrow">→</span>
            <div className="amb-cost-col is-new">
              <span>With ambassador</span>
              <b>{formatCoins(stake * AMBASSADOR_COST_MULT)}</b>
            </div>
          </div>

          <button className="cta amb-continue" onClick={() => onSelect(confirm.id)}>
            <span className="cta-label">Continue</span>
          </button>
          <button className="amb-cancel" onClick={() => setConfirm(null)}>Back</button>
        </div>
      ) : (
        <div key="list" className="sheet amb-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Our ambassadors">
          <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          <div className="amb-hero"><HeartIcon size={22} /></div>
          <div className="sheet-title">Our ambassadors</div>
          <div className="sheet-sub">Pick your favorite and play with her</div>
          <div className="amb-mode-note">Ambassador mode · bet ×{AMBASSADOR_COST_MULT}</div>

          <div className="amb-list">
            {MODELS.map(m => {
              const active = m.id === current
              return (
                <button key={m.id} className={`amb-card ${active ? 'is-active' : ''}`} onClick={() => !active && choose(m)}>
                  <span className="amb-photo"><video src={m.poster} muted playsInline preload="metadata" /></span>
                  <span className="amb-info">
                    <span className="amb-name">{m.name}, {m.age}</span>
                    <span className="amb-country"><Flag code={m.country} size={18} /> {COUNTRY[m.country]}</span>
                    <span className="amb-role"><VerifiedIcon size={13} /> Official ambassador</span>
                  </span>
                  {active
                    ? <span className="amb-playing"><HeartIcon size={12} /> Playing</span>
                    : <span className="cta amb-play"><span className="cta-label">Play</span></span>}
                </button>
              )
            })}
          </div>

          {current && (
            <button className="glass btn-ghost amb-none" onClick={() => onSelect(null)}>Play without ambassador</button>
          )}
        </div>
      )}
    </div>
  )
}
