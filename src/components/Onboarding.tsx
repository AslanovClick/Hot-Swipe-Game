import { useState, type ReactNode } from 'react'
import { CheckIcon, CloseIcon, HeartIcon } from './icons'

// One pick per category; collected for later personalization, doesn't affect the feed yet
export interface Preferences {
  hair: string | null
  body: string | null
  ethnicity: string | null
}

export const EMPTY_PREFERENCES: Preferences = { hair: null, body: null, ethnicity: null }

interface Option { id: string; label: string; visual: ReactNode }

const img = (src: string) => <img src={src} alt="" draggable={false} />

// Body-type artwork is a single-color SVG used as a mask, so it follows currentColor
const bodyArt = (id: string) => (
  <span className="onb-body-art" style={{ maskImage: `url(/onboarding/body-${id}.svg)`, WebkitMaskImage: `url(/onboarding/body-${id}.svg)` }} />
)

const CATEGORIES: { key: keyof Preferences; title: string; options: Option[] }[] = [
  {
    key: 'hair',
    title: 'Hair',
    options: [
      { id: 'blonde', label: 'Blonde', visual: img('/onboarding/hair-blonde.webp') },
      { id: 'brunette', label: 'Brunette', visual: img('/onboarding/hair-brunette.webp') },
      { id: 'chestnut', label: 'Chestnut', visual: img('/onboarding/hair-chestnut.webp') },
    ],
  },
  {
    key: 'body',
    title: 'Body type',
    options: [
      { id: 'slim', label: 'Slim', visual: bodyArt('slim') },
      { id: 'athletic', label: 'Athletic', visual: bodyArt('athletic') },
      { id: 'curvy', label: 'Curvy', visual: bodyArt('curvy') },
    ],
  },
  {
    key: 'ethnicity',
    title: 'Ethnicity',
    options: [
      { id: 'white', label: 'White', visual: img('/onboarding/eth-white.webp') },
      { id: 'asian', label: 'Asian', visual: img('/onboarding/eth-asian.webp') },
      { id: 'african', label: 'African', visual: img('/onboarding/eth-african.webp') },
    ],
  },
]

// Drops answers that are no longer offered (e.g. saved before an option was removed)
export function sanitizePreferences(p: Partial<Preferences> | null): Preferences {
  const out = { ...EMPTY_PREFERENCES }
  for (const cat of CATEGORIES) {
    const v = p?.[cat.key]
    out[cat.key] = cat.options.some(o => o.id === v) ? (v as string) : null
  }
  return out
}

interface Props {
  initial: Preferences
  // 'first' runs before the game (can be skipped); 'edit' is opened from the menu
  mode: 'first' | 'edit'
  onDone: (prefs: Preferences) => void
  onClose: () => void
}

export function Onboarding({ initial, mode, onDone, onClose }: Props) {
  const [prefs, setPrefs] = useState<Preferences>(initial)
  const picked = CATEGORIES.filter(c => prefs[c.key] !== null).length
  const complete = picked === CATEGORIES.length

  // Single choice per category; tapping the picked card clears it
  const pick = (key: keyof Preferences, id: string) =>
    setPrefs(p => ({ ...p, [key]: p[key] === id ? null : id }))

  return (
    <div className="onboarding">
      <div className="onb-glow" />
      <div className="onb-top">
        <div className="onb-kicker"><HeartIcon size={14} /> Preferences</div>
        {mode === 'first'
          ? <button className="onb-link" onClick={() => onDone(prefs)}>Skip</button>
          : <button className="sheet-x onb-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>}
      </div>

      <h1 className="onb-title">What's <span>your type?</span></h1>
      <p className="onb-hint">Pick one in each category — we'll tune the feed to you.</p>

      <div className="onb-progress" aria-label={`${picked} of ${CATEGORIES.length} chosen`}>
        {CATEGORIES.map(c => <span key={c.key} className={prefs[c.key] ? 'is-done' : ''} />)}
        <b>{picked}/{CATEGORIES.length}</b>
      </div>

      {CATEGORIES.map((cat, ci) => (
        <section key={cat.key} className="onb-section" style={{ animationDelay: `${ci * 80}ms` }}>
          <div className="onb-section-title">
            {cat.title}
            {prefs[cat.key] && <span className="onb-section-pick">{cat.options.find(o => o.id === prefs[cat.key])?.label}</span>}
          </div>
          <div className={`onb-grid is-${cat.key}`} role="radiogroup" aria-label={cat.title}>
            {cat.options.map(o => {
              const on = prefs[cat.key] === o.id
              return (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={on}
                  className={`onb-card ${on ? 'is-on' : ''}`}
                  onClick={() => pick(cat.key, o.id)}
                >
                  <span className="onb-visual">{o.visual}</span>
                  <span className="onb-label">{o.label}</span>
                  <span className="onb-check"><CheckIcon size={11} /></span>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <div className="onb-actions">
        <button className="cta" onClick={() => onDone(prefs)} disabled={!complete}>
          <span className="cta-label">{mode === 'first' ? 'Start playing' : 'Save preferences'}</span>
        </button>
      </div>
    </div>
  )
}
