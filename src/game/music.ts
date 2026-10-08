import { useEffect } from 'react'

// Background loop. The file is the loop with half a second of the same (periodic) audio on both
// sides, so the loop points below are seamless even where the mp3 decoder adds encoder delay.
const SRC = '/audio/lounge-loop.mp3'
const LOOP_START = 0.5
const LOOP_END = 84.0331
const VOLUME = 0.32
const FADE_IN = 2.5
const FADE_OUT = 0.5

let ctx: AudioContext | null = null
let gain: GainNode | null = null
let started = false
let wanted = false
// Fetched up front (no audio context needed), decoded once the player has interacted
const data = typeof fetch === 'function' ? fetch(SRC).then(r => r.arrayBuffer()).catch(() => null) : Promise.resolve(null)

async function start() {
  if (started || !ctx || !gain) return
  started = true
  const raw = await data
  if (!raw) return
  const buffer = await ctx.decodeAudioData(raw.slice(0))
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  src.loopStart = LOOP_START
  src.loopEnd = Math.min(LOOP_END, buffer.duration)
  src.connect(gain)
  src.start(0, LOOP_START)
  apply()
}

// Fades to the wanted state; a silent context is suspended so it doesn't keep the audio device busy
function apply() {
  if (!ctx || !gain) return
  const on = wanted && document.visibilityState === 'visible'
  const now = ctx.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  if (on) {
    ctx.resume().catch(() => {})
    gain.gain.linearRampToValueAtTime(VOLUME, now + FADE_IN)
  } else {
    gain.gain.linearRampToValueAtTime(0, now + FADE_OUT)
    const c = ctx
    setTimeout(() => { if (!wanted || document.visibilityState !== 'visible') c.suspend().catch(() => {}) }, FADE_OUT * 1000 + 50)
  }
}

// Browsers only allow sound after a user gesture. On touch screens only the end of a tap counts
// (not pointerdown), so the listeners stay until the context is actually running.
const GESTURES = ['pointerup', 'touchend', 'click', 'keydown'] as const

function listen(on: boolean) {
  for (const e of GESTURES) {
    if (on) window.addEventListener(e, unlock, { capture: true })
    else window.removeEventListener(e, unlock, { capture: true })
  }
}

function unlock() {
  if (!wanted) return
  if (!ctx) {
    ctx = new AudioContext()
    gain = ctx.createGain()
    gain.gain.value = 0
    gain.connect(ctx.destination)
  }
  start()
  apply()
  const c = ctx
  c.resume().then(() => { if (c.state === 'running') listen(false) }).catch(() => {})
}

// Dev hook for checks: __music() → context state, current gain, whether the loop started
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__music = () => ({ state: ctx?.state, gain: gain?.gain.value, started })
}

export function useMusic(enabled: boolean) {
  useEffect(() => {
    wanted = enabled
    if (!enabled) return apply()
    // Turned on after the page has had a gesture: sound can start right away
    if (navigator.userActivation?.hasBeenActive) unlock()
    if (ctx?.state !== 'running') listen(true)
  }, [enabled])

  useEffect(() => {
    document.addEventListener('visibilitychange', apply)
    return () => document.removeEventListener('visibilitychange', apply)
  }, [])
}
