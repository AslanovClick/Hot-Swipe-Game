import { COLORS, modeFor, resultWeights, type Color } from './config'

export type Country = 'es' | 'us' | 'gb'

// Each model has an idle loop (shown while betting) and one reveal video per color;
// the reveal for the drawn result plays, and the round settles when it ends.
export interface Model {
  id: string
  name: string
  age: number
  city: string
  country: Country
  idle: string
  reveal: Record<Color, string>
  // Still frame for cards (media fragment: first second of the idle loop)
  poster: string
}

const model = (n: number, name: string, age: number, city: string, country: Country): Model => {
  const dir = `/models/model-${n}`
  return {
    id: String(n),
    name,
    age,
    city,
    country,
    idle: `${dir}/idle.mp4`,
    reveal: { black: `${dir}/black.mp4`, red: `${dir}/red.mp4`, white: `${dir}/white.mp4` },
    poster: `${dir}/idle.mp4#t=1`,
  }
}

export const MODELS: Model[] = [
  model(4, 'Sofia', 23, 'Barcelona, Spain', 'es'),
  model(5, 'Bella', 24, 'Los Angeles, USA', 'us'),
  model(6, 'Ruby', 22, 'London, UK', 'gb'),
]

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

const mod = (n: number, m: number) => ((n % m) + m) % m

function shuffledBag(size: number, block: number): number[] {
  const bag = Array.from({ length: size }, (_, i) => i)
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(hash(block, 1, i) * (i + 1))
    ;[bag[i], bag[j]] = [bag[j], bag[i]]
  }
  return bag
}

// Models come from a shuffled bag per block of rounds, so the same one never shows twice in a row.
// The boundary fix only swaps the first two slots, so a block's last slot never changes.
function modelIndex(round: number): number {
  const n = MODELS.length
  const block = Math.floor(round / n)
  const bag = shuffledBag(n, block)
  const prev = shuffledBag(n, block - 1)
  if (n > 1 && bag[0] === prev[n - 1]) [bag[0], bag[1]] = [bag[1], bag[0]]
  return bag[mod(round, n)]
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

// Dev only: `?force=6-white` (or `?force=6`, `?force=white`) pins the model and/or result of
// every round, so each clip can be checked without waiting for the RNG
function devForce(): { model?: Model; result?: Color } {
  if (!import.meta.env.DEV) return {}
  const raw = new URLSearchParams(location.search).get('force')
  if (!raw) return {}
  const parts = raw.toLowerCase().split('-')
  return {
    model: MODELS.find(m => parts.includes(m.id)),
    result: COLORS.find(c => parts.includes(c)),
  }
}

const FORCE = devForce()

// Rotation: with an ambassador the same model repeats, otherwise a new random one each round
export function roundInfo(round: number, ambassador: string | null, highRisk = false): Round {
  return {
    model: FORCE.model || (ambassador && MODELS.find(m => m.id === ambassador)) || MODELS[modelIndex(round)],
    result: FORCE.result || pickResult(round, highRisk),
  }
}
