import { useState, type ReactNode } from 'react'
import { hasPreferences, type LookPrefs } from '../game/scenes'
import { CheckIcon, CloseIcon, HeartIcon, ShuffleIcon } from './icons'

// One pick per category; tunes which models the feed shows (see the lineup in game/scenes)
export type Preferences = LookPrefs

export const EMPTY_PREFERENCES: Preferences = { hair: null, body: null, ethnicity: null }

interface Option { id: string; label: string; visual: ReactNode }

const img = (src: string) => <img src={src} alt="" draggable={false} />

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
      { id: 'slim', label: 'Slim', visual: img('/onboarding/body-slim.webp') },
      { id: 'athletic', label: 'Athletic', visual: img('/onboarding/body-athletic.webp') },
      { id: 'curvy', label: 'Curvy', visual: img('/onboarding/body-curvy.webp') },
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

export const describePreferences = (p: Preferences | null) =>
  CATEGORIES.map(c => c.options.find(o => o.id === p?.[c.key])?.label).filter(Boolean).join(' · ')

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
  // 'first' runs before the game (skipping it keeps the feed fully random); 'edit' is opened from the menu
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
          ? <button className="onb-link" onClick={() => onDone(EMPTY_PREFERENCES)}>Skip</button>
          : <button className="sheet-x onb-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>}
      </div>

      <h1 className="onb-title">What's <span>your type?</span></h1>
      <p className="onb-hint">Pick one in each category — we'll tune the feed to you.</p>

      <div className="onb-progress" aria-label={`${picked} of ${CATEGORIES.length} chosen`}>
        {/* Fills left to right by how many are chosen, whichever categories they are */}
        {CATEGORIES.map((c, i) => <span key={c.key} className={i < picked ? 'is-done' : ''} />)}
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
        {/* Clears the saved preferences and goes back to a fully random feed */}
        {mode === 'edit' && hasPreferences(initial) && (
          <button className="onb-reset" onClick={() => onDone(EMPTY_PREFERENCES)}>
            <ShuffleIcon size={14} /> Reset to random feed
          </button>
        )}
      </div>
    </div>
  )
}
