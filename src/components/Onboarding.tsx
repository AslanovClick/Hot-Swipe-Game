import { useState, type ReactNode } from 'react'
import { CheckIcon, HeartIcon } from './icons'

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

const BODY_TYPES = [
  { id: 'slim', label: 'Slim' },
  { id: 'athletic', label: 'Athletic' },
  { id: 'curvy', label: 'Curvy' },
  { id: 'unique', label: 'Unique' },
]

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
    options: BODY_TYPES.map(b => ({ ...b, visual: bodyArt(b.id) })),
  },
  {
    key: 'ethnicity',
    title: 'Ethnicity',
    options: [
      { id: 'white', label: 'White', visual: img('/onboarding/eth-white.webp') },
      { id: 'mixed', label: 'Mixed', visual: img('/onboarding/eth-mixed.webp') },
      { id: 'asian', label: 'Asian', visual: img('/onboarding/eth-asian.webp') },
      { id: 'african', label: 'African', visual: img('/onboarding/eth-african.webp') },
    ],
  },
]

interface Props {
  initial: Preferences
  onDone: (prefs: Preferences) => void
}

export function Onboarding({ initial, onDone }: Props) {
  const [prefs, setPrefs] = useState<Preferences>(initial)
  const complete = CATEGORIES.every(c => prefs[c.key] !== null)

  // Single choice per category; tapping the picked card clears it
  const pick = (key: keyof Preferences, id: string) =>
    setPrefs(p => ({ ...p, [key]: p[key] === id ? null : id }))

  return (
    <div className="onboarding">
      <div className="onb-top">
        <div className="onb-kicker"><HeartIcon size={14} /> Choose your preferences</div>
        <button className="onb-link" onClick={() => onDone(prefs)}>Skip</button>
      </div>

      <h1 className="onb-title">What's your type?</h1>
      <p className="onb-hint">Pick one in each category</p>

      {CATEGORIES.map((cat, ci) => (
        <section key={cat.key} className="onb-section" style={{ animationDelay: `${ci * 80}ms` }}>
          <div className="onb-section-title">{cat.title}</div>
          <div className={`onb-grid cols-${cat.options.length}`} role="radiogroup" aria-label={cat.title}>
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
                  <span className="onb-check"><CheckIcon size={10} /></span>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <div className="onb-actions">
        <button className="cta" onClick={() => onDone(prefs)} disabled={!complete}>
          <span className="cta-label">Start playing</span>
        </button>
      </div>
    </div>
  )
}
