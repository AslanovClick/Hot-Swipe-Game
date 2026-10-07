import { useState } from 'react'
import { AMBASSADOR_COST_MULT } from '../game/config'
import { MODELS, type Model } from '../game/scenes'
import { formatCoins } from './Header'
import { CheckIcon, CloseIcon, Flag, HeartIcon, LockIcon, RepeatIcon, VerifiedIcon } from './icons'

interface Props {
  current: string | null
  stake: number
  onSelect: (id: string | null) => void
  onClose: () => void
}

const COUNTRY: Record<Model['country'], string> = { es: 'Spain', us: 'USA', gb: 'UK' }

export function AmbassadorSheet({ current, stake, onSelect, onClose }: Props) {
  const [focus, setFocus] = useState<string | null>(current ?? MODELS[0].id)
  const [confirm, setConfirm] = useState<Model | null>(null)
  const focused = MODELS.find(m => m.id === focus) ?? null

  // The cost notice is shown when the mode is switched on; switching between ambassadors skips it
  const play = (m: Model) => (current ? onSelect(m.id) : setConfirm(m))

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      {confirm ? (
        <div key="confirm" className="sheet amb-confirm" onClick={e => e.stopPropagation()} role="dialog" aria-label="Play with ambassador">
          <div className="sheet-head">
            <span className="sheet-head-title">Ambassador mode</span>
            <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          </div>

          <div className="amb-hero">
            <video src={confirm.poster} muted playsInline preload="metadata" />
            <span className="amb-hero-shade" />
            <span className="amb-tile-official"><VerifiedIcon size={11} /> Official ambassador</span>
            <span className="amb-hero-info">
              <b>{confirm.name}, {confirm.age}</b>
              <span><Flag code={confirm.country} size={16} /> {COUNTRY[confirm.country]}</span>
            </span>
          </div>

          <div className="amb-price">
            <div className="amb-price-top">
              <span>Bet per round</span>
              <span className="amb-price-mult">×{AMBASSADOR_COST_MULT}</span>
            </div>
            <div className="amb-price-values">
              <s>{formatCoins(stake)}</s>
              <span className="amb-price-arrow">→</span>
              <b>{formatCoins(stake * AMBASSADOR_COST_MULT)}</b>
            </div>
          </div>

          <ul className="amb-perks">
            <li><span><RepeatIcon size={14} /></span>{confirm.name} stars in every round at the new bet</li>
            <li><span><LockIcon size={14} /></span>Switch it off anytime</li>
          </ul>

          <button className="cta amb-continue" onClick={() => onSelect(confirm.id)}>
            <span className="cta-label">Play with {confirm.name}</span>
          </button>
          <button className="amb-cancel" onClick={() => setConfirm(null)}>Back</button>
        </div>
      ) : (
        <div key="list" className="sheet amb-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Our ambassadors">
          <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          <div className="sheet-title">Our ambassadors</div>
          <div className="sheet-sub">Pick your favorite and play with her</div>
          <div className="amb-mode-note"><HeartIcon size={12} /> Ambassador mode · every round at bet ×{AMBASSADOR_COST_MULT}</div>

          <div className="amb-grid" role="radiogroup" aria-label="Ambassadors">
            {MODELS.map((m, i) => {
              const isFocus = m.id === focus
              const isCurrent = m.id === current
              return (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={isFocus}
                  className={`amb-tile ${isFocus ? 'is-focus' : ''} ${isCurrent ? 'is-current' : ''}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                  onClick={() => setFocus(m.id)}
                >
                  <video className="amb-tile-photo" src={m.poster} muted playsInline preload="metadata" />
                  <span className="amb-tile-shade" />
                  <span className="amb-tile-official"><VerifiedIcon size={11} /> Official</span>
                  <span className="amb-tile-info">
                    <b>{m.name}, {m.age}</b>
                    <span><Flag code={m.country} size={14} /> {COUNTRY[m.country]}</span>
                  </span>
                  {isCurrent && <span className="amb-tile-now">Now playing</span>}
                  {isFocus && <span className="amb-tile-check"><CheckIcon size={11} /></span>}
                </button>
              )
            })}
          </div>

          <button
            className="cta amb-continue"
            disabled={!focused || focused.id === current}
            onClick={() => focused && play(focused)}
          >
            <span className="cta-label">
              {!focused ? 'Pick an ambassador' : focused.id === current ? `Playing with ${focused.name}` : `Play with ${focused.name}`}
            </span>
          </button>
          {current && (
            <button className="amb-cancel" onClick={() => onSelect(null)}>Play without ambassador</button>
          )}
        </div>
      )}
    </div>
  )
}
