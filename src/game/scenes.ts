import { COLORS, modeFor, resultWeights, type Color } from './config'

export type Country = 'es' | 'us' | 'gb'

// Looks the feed is tuned by; the same ids the preferences screen offers
export type Ethnicity = 'white' | 'asian' | 'african'
export type Hair = 'blonde' | 'brunette' | 'chestnut'
export type Body = 'slim' | 'athletic' | 'curvy'

export interface Looks {
  ethnicity: Ethnicity
  hair: Hair
  body: Body
}

// Player's picks per category; null = no preference
export type LookPrefs = { [K in keyof Looks]: string | null }

// Each model has an idle loop (shown while betting) and one reveal video per color;
// the reveal for the drawn result plays, and the round settles when it ends.
export interface Model {
  id: string
  name: string
  age: number
  city: string
  country: Country
  looks: Looks
  ambassador: boolean
  idle: string
  reveal: Record<Color, string>
  // Still frame for cards (media fragment: first second of the idle loop)
  poster: string
}

const model = (
  [ethnicity, hair, body]: [Ethnicity, Hair, Body],
  name: string, age: number, city: string, country: Country, ambassador = false,
): Model => {
  const dir = `/models/${ethnicity}/${hair}-${body}`
  return {
    id: `${ethnicity}-${hair}-${body}`,
    name,
    age,
    city,
    country,
    looks: { ethnicity, hair, body },
    ambassador,
    idle: `${dir}/idle.mp4`,
    reveal: { black: `${dir}/black.mp4`, red: `${dir}/red.mp4`, white: `${dir}/white.mp4` },
    poster: `${dir}/idle.mp4#t=1`,
  }
}

export const MODELS: Model[] = [
  model(['white', 'blonde', 'slim'], 'Sofia', 23, 'Barcelona, Spain', 'es', true),
  model(['white', 'brunette', 'curvy'], 'Bella', 24, 'Los Angeles, USA', 'us', true),
  model(['white', 'chestnut', 'athletic'], 'Ruby', 22, 'London, UK', 'gb', true),
  model(['white', 'blonde', 'athletic'], 'Chloe', 22, 'Miami, USA', 'us'),
  model(['white', 'blonde', 'curvy'], 'Grace', 25, 'Manchester, UK', 'gb'),
  model(['white', 'brunette', 'slim'], 'Lucia', 21, 'Madrid, Spain', 'es'),
  model(['white', 'brunette', 'athletic'], 'Emma', 23, 'New York, USA', 'us'),
  model(['white', 'chestnut', 'slim'], 'Lily', 24, 'Brighton, UK', 'gb'),
  model(['white', 'chestnut', 'curvy'], 'Elena', 25, 'Valencia, Spain', 'es'),
]

export const AMBASSADORS = MODELS.filter(m => m.ambassador)

// Everything random about a round (model, result) is derived from a per-session seed and the
// round number, so neighbouring slides in the feed render consistently and a round never re-rolls.
const SESSION_SEED = (Math.random() * 2 ** 31) | 0

const hash = (...parts: number[]) => {
  let t = SESSION_SEED
  for (const p of parts) {
    t = Math.imul(t ^ (p + 0x9e3779b9), 0x85ebca6b)
    t ^= t >>> 13
    t = Math.imul(t, 0xc2b2ae35)
    t ^= t >>> 16
  }
  return (t >>> 0) / 4294967296
}

// Preference matching, by priority: ethnicity, then body type, then hair. Each level outweighs
// all lower ones together, so e.g. a matching body type beats a matching hair color.
const PRIORITY: Record<keyof Looks, number> = { ethnicity: 4, body: 2, hair: 1 }

export const hasPreferences = (p: LookPrefs | null) => !!p && Object.values(p).some(v => v !== null)

const matchScore = (m: Model, p: LookPrefs | null) =>
  p ? (Object.keys(PRIORITY) as (keyof Looks)[]).reduce((s, k) => s + (p[k] === m.looks[k] ? PRIORITY[k] : 0), 0) : 0

// Closer matches show up more often (each priority step doubles the odds) but every model stays
// in rotation. Without preferences all weights are equal: a fully random feed.
function weightedModel(roll: number, candidates: Model[], p: LookPrefs | null): Model {
  const weights = candidates.map(m => 2 ** matchScore(m, p))
  let r = roll * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i]
    if (r < 0) return candidates[i]
  }
  return candidates[candidates.length - 1]
}

// Model per round, drawn lazily and kept, so rounds already on screen never change.
// New preferences only redraw the rounds from the given one on.
let lineupPrefs: LookPrefs | null = null
let lineupStart = 0
const lineup: Model[] = []

export function setLineupPreferences(p: LookPrefs | null, fromRound: number) {
  lineup.length = Math.min(lineup.length, Math.max(0, fromRound))
  lineupPrefs = hasPreferences(p) ? p : null
  lineupStart = Math.max(0, fromRound)
}

function drawModel(round: number, prev: Model | null): Model {
  // Never the same model twice in a row
  const candidates = MODELS.length > 1 ? MODELS.filter(m => m !== prev) : MODELS
  // The first round with new preferences opens with the best match (an exact one when it exists)
  if (lineupPrefs && round === lineupStart) {
    const best = Math.max(...candidates.map(m => matchScore(m, lineupPrefs)))
    const top = candidates.filter(m => matchScore(m, lineupPrefs) === best)
    return top[Math.floor(hash(round, 1) * top.length)]
  }
  return weightedModel(hash(round, 1), candidates, lineupPrefs)
}

function lineupModel(round: number): Model {
  if (round < 0) return MODELS[Math.floor(hash(round, 1) * MODELS.length)]
  while (lineup.length <= round) lineup.push(drawModel(lineup.length, lineup[lineup.length - 1] ?? null))
  return lineup[round]
}

// One roll per round, mapped through the active math mode's odds
function pickResult(round: number, highRisk: boolean): Color {
  const weights = resultWeights(modeFor(highRisk))
  const total = COLORS.reduce((s, c) => s + weights[c], 0)
  let r = hash(round, 2) * total
  for (const c of COLORS) {
    r -= weights[c]
    if (r < 0) return c
  }
  return COLORS[COLORS.length - 1]
}

export interface Round {
  model: Model
  result: Color
}

// Dev only: `?model=blonde-slim` and/or `?result=white` pin the model and/or result of every
// round, so each clip can be checked without waiting for the RNG
function devForce(): { model?: Model; result?: Color } {
  if (!import.meta.env.DEV) return {}
  const q = new URLSearchParams(location.search)
  const model = q.get('model')?.toLowerCase()
  const result = q.get('result')?.toLowerCase()
  return {
    model: model ? MODELS.find(m => m.id.endsWith(model)) : undefined,
    result: COLORS.find(c => c === result),
  }
}

const FORCE = devForce()

// Rotation: with an ambassador the same model repeats (preferences don't apply),
// otherwise the next model from the lineup
export function roundInfo(round: number, ambassador: string | null, highRisk = false): Round {
  return {
    model: FORCE.model || (ambassador && MODELS.find(m => m.id === ambassador)) || lineupModel(round),
    result: FORCE.result || pickResult(round, highRisk),
  }
}
