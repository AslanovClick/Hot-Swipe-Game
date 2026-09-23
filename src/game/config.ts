export type Color = 'black' | 'red' | 'white'

export const COLORS: Color[] = ['black', 'red', 'white']

export const MULTIPLIERS: Record<Color, number> = {
  black: 1.45,
  red: 2.8,
  white: 7.2,
}

export const COLOR_LABEL: Record<Color, string> = {
  black: 'Black',
  red: 'Red',
  white: 'White',
}

// Phase durations, ms
export const BETTING_MS = 4000
export const REVEAL_MS = 2600
export const RESULT_MS = 3200
export const RESULT_NO_BET_MS = 2200
export const ADVANCE_MS = 600

export const START_BALANCE = 1000
export const DEFAULT_STAKE = 10
export const STAKE_STEPS = [1, 5, 10, 25, 50, 100, 250, 500, 1000]

// Playing with an ambassador raises the cost of a round (the placed bet) by this factor
export const AMBASSADOR_COST_MULT = 1.5
