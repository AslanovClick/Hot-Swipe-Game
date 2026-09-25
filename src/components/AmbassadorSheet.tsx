import { useState } from 'react'
import { AMBASSADOR_COST_MULT } from '../game/config'
import { MODELS, type Model } from '../game/scenes'
import { formatCoins } from './Header'
import { CloseIcon, HeartIcon, PinIcon } from './icons'

interface Props {
  current: string | null
  stake: number
  onSelect: (id: string | null) => void
  onClose: () => void
}

export function AmbassadorSheet({ current, stake, onSelect, onClose }: Props) {
  const [confirm, setConfirm] = useState<Model | null>(null)

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      {confirm ? (
        <div key="confirm" className="sheet amb-confirm" onClick={e => e.stopPropagation()} role="dialog" aria-label="Play with ambassador">
          <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          <div className="amb-confirm-heart"><HeartIcon size={30} /></div>
          <div className="sheet-title">Play with ambassador</div>
          <div className="amb-confirm-sub">You chose <b>{confirm.name}</b>!</div>
          <p className="amb-confirm-note">When you play with an ambassador, the cost of each round goes up.</p>

          <div className="amb-cost glass">
            <div><span>Regular bet</span><b>{formatCoins(stake)}</b></div>
            <div><span>New bet</span><b className="is-new">{formatCoins(stake * AMBASSADOR_COST_MULT)}</b></div>
          </div>

          <button className="cta amb-continue" onClick={() => onSelect(confirm.id)}>
            <span className="cta-label">Continue</span>
          </button>
          <button className="amb-cancel" onClick={() => setConfirm(null)}>Cancel</button>
        </div>
      ) : (
        <div key="list" className="sheet amb-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Our ambassadors">
          <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          <div className="sheet-title">Our ambassadors</div>
          <div className="amb-sub">Pick your favorite model and play with her</div>

          <div className="amb-list">
            {MODELS.map(s => {
              const active = s.id === current
              return (
                <div key={s.id} className={`amb-card ${active ? 'is-active' : ''}`}>
                  <span className="amb-photo"><img src={s.clothe} alt="" /></span>
                  <div className="amb-info">
                    <div className="amb-name">{s.name}, {s.age}</div>
                    <div className="amb-role"><HeartIcon size={11} /> Official ambassador</div>
                    <div className="amb-city"><PinIcon /> {s.city}</div>
                  </div>
                  {active ? (
                    <span className="amb-playing">Playing</span>
                  ) : (
                    <button className="cta amb-play" onClick={() => setConfirm(s)}>
                      <span className="cta-label">Play</span>
                    </button>
                  )}
                </div>
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
