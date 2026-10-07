export type Color = 'black' | 'red' | 'white'

export const COLORS: Color[] = ['black', 'red', 'white']

// Math configs. Each color's odds are inverse to its multiplier, so every pick has the same
// expected return; High Risk spreads the multipliers further apart (cheaper favourite,
// rarer and bigger long shots).
export interface MathMode {
  multipliers: Record<Color, number>
}

export const NORMAL_MODE: MathMode = {
  multipliers: { black: 1.45, red: 2.8, white: 7.2 },
}

export const HIGH_RISK_MODE: MathMode = {
  multipliers: { black: 1.2, red: 3.6, white: 18 },
}

export const modeFor = (highRisk: boolean) => (highRisk ? HIGH_RISK_MODE : NORMAL_MODE)

export const resultWeights = (mode: MathMode): Record<Color, number> => ({
  black: 1 / mode.multipliers.black,
  red: 1 / mode.multipliers.red,
  white: 1 / mode.multipliers.white,
})

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
// Short win / lose state before the next round
export const RESULT_MS = 2600
export const ADVANCE_MS = 600

export const START_BALANCE = 1000
export const DEFAULT_STAKE = 10
export const STAKE_STEPS = [1, 5, 10, 25, 50, 100, 250, 500, 1000]

// Playing with an ambassador raises the cost of a round (the placed bet) by this factor
export const AMBASSADOR_COST_MULT = 1.5
