export type Color = 'black' | 'red' | 'white'

export const COLORS: Color[] = ['black', 'red', 'white']

export const MULTIPLIERS: Record<Color, number> = {
  black: 1.45,
  red: 2.8,
  white: 7.2,
}

// Relative odds of each revealed color. Inverse to the multipliers, so every color has the same
// expected return (~84%); tweak freely.
export const RESULT_WEIGHTS: Record<Color, number> = {
  black: 1 / 1.45,
  red: 1 / 2.8,
  white: 1 / 7.2,
}

export const COLOR_LABEL: Record<Color, string> = {
  black: 'Black',
  red: 'Red',
  white: 'White',
}

// Phase durations, ms
export const BETTING_MS = 4000
// The reveal lasts as long as the reveal video (up to ~8 s); this is only a fallback
// if the video stalls or fails to load
export const REVEAL_MAX_MS = 10000
export const RESULT_MS = 3200
export const RESULT_NO_BET_MS = 2200
export const ADVANCE_MS = 600

export const START_BALANCE = 1000
export const DEFAULT_STAKE = 10
// Fixed bet amounts offered as chips in the bet panel
export const BET_CHIPS = [10, 25, 50, 100]

// Playing with an ambassador raises the cost of a round (the placed bet) by this factor
export const AMBASSADOR_COST_MULT = 1.5
