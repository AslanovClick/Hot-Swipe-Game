# Hot Swipe — MVP prototype (Version 1)

The working version (video models, docked bet panel). Earlier layouts: `version-2` (same game, kept as a snapshot) and `version-3` (the original full-screen feed layout).

Vertical feed game: each round shows a model, the player picks the sports top color (Black ×1.45 / Red ×2.80 / White ×7.20) and places a bet in virtual coins. After a 4 s timer (or on BET) the scene reveals the actual color and the round is settled, then the feed auto-scrolls to the next model.

No real money — balance is virtual and stored in `localStorage`.

## Run

```bash
npm install
npm run dev
```

Build: `npm run build` (output in `dist/`).

## Structure

- `src/game/config.ts` — multipliers, phase durations, stake steps
- `src/game/scenes.ts` — model data and before/after images (outcome fixed per scene for now)
- `src/game/useGame.ts` — round state machine: betting → reveal → result → advancing
- `src/components/` — header, feed, controls, result overlay, bet size sheet, menu
- `src/glass.ts` — liquid-glass backdrop (refraction/dispersion in Chromium, blur fallback elsewhere)
