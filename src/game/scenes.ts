import { COLORS, RESULT_WEIGHTS, type Color } from './config'

// A model is a set of transparent PNG states: `clothe` is shown while betting,
// one of the colored states is revealed as the round result.
export interface Model {
  id: string
  name: string
  age: number
  city: string
  clothe: string
  states: Record<Color, string>
}

const model = (n: number, name: string, age: number, city: string): Model => ({
  id: String(n),
  name,
  age,
  city,
  clothe: `/girls/g${n}-clothe.webp`,
  states: { black: `/girls/g${n}-black.webp`, red: `/girls/g${n}-red.webp`, white: `/girls/g${n}-white.webp` },
})

export const MODELS: Model[] = [
  model(1, 'Chloe', 24, 'Miami, USA'),
  model(2, 'Bella', 23, 'Las Vegas, USA'),
  model(3, 'Ava', 25, 'Los Angeles, USA'),
]

export const BACKGROUNDS = [1, 2, 3, 4, 5, 6].map(n => `/backgrounds/bg-${n}.webp`)

// Everything random about a round (background, result) is derived from a per-session seed and the
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

function shuffledBag(block: number): number[] {
  const bag = BACKGROUNDS.map((_, i) => i)
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(hash(block, 1, i) * (i + 1))
    ;[bag[i], bag[j]] = [bag[j], bag[i]]
  }
  return bag
}

// Backgrounds come from a shuffled bag per block of rounds, so none repeats back-to-back.
// The boundary fix only swaps the first two slots, so a block's last slot never changes.
function backgroundBag(block: number): number[] {
  const bag = shuffledBag(block)
  const prev = shuffledBag(block - 1)
  if (bag[0] === prev[prev.length - 1]) [bag[0], bag[1]] = [bag[1], bag[0]]
  return bag
}

function pickResult(round: number): Color {
  const total = COLORS.reduce((s, c) => s + RESULT_WEIGHTS[c], 0)
  let r = hash(round, 2) * total
  for (const c of COLORS) {
    r -= RESULT_WEIGHTS[c]
    if (r < 0) return c
  }
  return COLORS[COLORS.length - 1]
}

export interface Round {
  model: Model
  background: string
  result: Color
}

export function roundInfo(round: number, ambassador: string | null): Round {
  const n = BACKGROUNDS.length
  const block = Math.floor(round / n)
  return {
    model: (ambassador && MODELS.find(m => m.id === ambassador)) || MODELS[mod(round, MODELS.length)],
    background: BACKGROUNDS[backgroundBag(block)[mod(round, n)]],
    result: pickResult(round),
  }
}
