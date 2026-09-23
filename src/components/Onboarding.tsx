import { useState, type ReactNode } from 'react'
import { BodyIcon, BODY_SHAPES, CheckIcon, HeartIcon } from './icons'

// Collected for later personalization; doesn't affect the feed yet
export interface Preferences {
  hair: string[]
  body: string[]
  ethnicity: string[]
}

interface Option { id: string; label: string; visual: ReactNode }

const img = (src: string) => <img src={src} alt="" draggable={false} />

const STEPS: { key: keyof Preferences; title: string; hint: string; cols: 3 | 2; options: Option[] }[] = [
  {
    key: 'hair',
    title: 'Hair',
    hint: 'Which hair color do you like?',
    cols: 3,
    options: [
      { id: 'blonde', label: 'Blonde', visual: img('/onboarding/hair-blonde.webp') },
      { id: 'brunette', label: 'Brunette', visual: img('/onboarding/hair-brunette.webp') },
      { id: 'chestnut', label: 'Chestnut', visual: img('/onboarding/hair-chestnut.webp') },
    ],
  },
  {
    key: 'body',
    title: 'Body type',
    hint: 'Which figure catches your eye?',
    cols: 2,
    options: (Object.keys(BODY_SHAPES) as (keyof typeof BODY_SHAPES)[]).map(id => ({
      id,
      label: { slim: 'Slim', athletic: 'Athletic', curvy: 'Curvy', unique: 'Unique shape' }[id],
      visual: <BodyIcon shape={id} size={78} />,
    })),
  },
  {
    key: 'ethnicity',
    title: 'Ethnicity',
    hint: 'Who would you like to see more of?',
    cols: 2,
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
  const [step, setStep] = useState(0)
  const [prefs, setPrefs] = useState<Preferences>(initial)
  const current = STEPS[step]
  const picked = prefs[current.key]
  const last = step === STEPS.length - 1

  const toggle = (id: string) =>
    setPrefs(p => ({
      ...p,
      [current.key]: p[current.key].includes(id) ? p[current.key].filter(x => x !== id) : [...p[current.key], id],
    }))

  const next = () => (last ? onDone(prefs) : setStep(step + 1))

  return (
    <div className="onboarding">
      <div className="onb-top">
        {step > 0
          ? <button className="onb-link" onClick={() => setStep(step - 1)}>Back</button>
          : <span />}
        <div className="onb-dots" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => <span key={s.key} className={i === step ? 'is-active' : i < step ? 'is-done' : ''} />)}
        </div>
        <button className="onb-link" onClick={() => onDone(prefs)}>Skip</button>
      </div>

      <div className="onb-head">
        <div className="onb-kicker"><HeartIcon size={14} /> Choose your preferences</div>
        <h1 key={current.key} className="onb-title">{current.title}</h1>
        <p className="onb-hint">{current.hint} <span>Pick one or more</span></p>
      </div>

      <div key={current.key} className={`onb-grid cols-${current.cols} is-${current.key}`}>
        {current.options.map((o, i) => {
          const on = picked.includes(o.id)
          return (
            <button
              key={o.id}
              className={`onb-card ${on ? 'is-on' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
              aria-pressed={on}
              onClick={() => toggle(o.id)}
            >
              <span className="onb-visual">{o.visual}</span>
              <span className="onb-label">{o.label}</span>
              <span className="onb-check"><CheckIcon /></span>
            </button>
          )
        })}
      </div>

      <div className="onb-actions">
        <button className="cta" onClick={next} disabled={picked.length === 0}>
          <span className="cta-label">{last ? 'Start playing' : 'Continue'}</span>
        </button>
      </div>
    </div>
  )
}
