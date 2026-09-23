import type { Color } from './config'

export interface Scene {
  id: string
  name: string
  age: number
  city: string
  before: string
  after: string
  // Placeholder: outcome is fixed by the "after" image until RNG + per-color reveals exist
  result: Color
}

export const SCENES: Scene[] = [
  { id: '1', name: 'Emma', age: 23, city: 'San Diego, USA', before: '/scenes/1-before.webp', after: '/scenes/1-after.webp', result: 'black' },
  { id: '2', name: 'Sofia', age: 24, city: 'Los Angeles, USA', before: '/scenes/2-before.webp', after: '/scenes/2-after.webp', result: 'white' },
  { id: '3', name: 'Mia', age: 22, city: 'New York, USA', before: '/scenes/3-before.webp', after: '/scenes/3-after.webp', result: 'red' },
  { id: '4', name: 'Olivia', age: 26, city: 'Miami, USA', before: '/scenes/4-before.webp', after: '/scenes/4-after.webp', result: 'black' },
]

export const sceneAt = (round: number) => SCENES[((round % SCENES.length) + SCENES.length) % SCENES.length]

// With an ambassador chosen, the feed loops her scene every round
export const sceneFor = (ambassador: string | null, round: number) =>
  (ambassador && SCENES.find(s => s.id === ambassador)) || sceneAt(round)
