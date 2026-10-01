import { useEffect, useRef } from 'react'
import type { Color } from '../game/config'
import { roundInfo, type Model } from '../game/scenes'
import type { Phase } from '../game/useGame'
import { PinIcon } from './icons'

interface Props {
  round: number
  phase: Phase
  ambassador: string | null
  paused: boolean
  onSwipeNext: () => void
  onRevealEnd: () => void
}

// Slides are keyed by absolute round number so the outgoing and incoming slides animate as one strip
export function Feed({ round, phase, ambassador, paused, onSwipeNext, onRevealEnd }: Props) {
  const offset = phase === 'advancing' ? 1 : 0
  const startY = useRef<number | null>(null)

  const slides = [round - 1, round, round + 1, round + 2]

  return (
    <div
      className="feed"
      onPointerDown={e => { startY.current = e.clientY }}
      onPointerUp={e => {
        if (startY.current !== null && startY.current - e.clientY > 60) onSwipeNext()
        startY.current = null
      }}
      onWheel={e => { if (e.deltaY > 30) onSwipeNext() }}
    >
      {slides.map(abs => {
        const { model, result } = roundInfo(abs, ambassador)
        const current = abs === round
        const pos = abs - round - offset
        return (
          <section
            key={abs}
            className={`slide ${current ? 'is-current' : ''}`}
            style={{ transform: `translate3d(0, ${pos * 100}%, 0)` }}
            aria-hidden={!current}
          >
            <SlideVideo
              model={model}
              result={result}
              // Current and next slides buffer fully; the rest only fetch metadata
              preload={abs === round || abs === round + 1 ? 'auto' : 'metadata'}
              idlePlaying={current && phase === 'betting' && !paused}
              revealShown={abs < round || (current && phase !== 'betting')}
              revealPlaying={current && phase === 'reveal' && !paused}
              onRevealEnd={current ? onRevealEnd : undefined}
            />
            <div className="scrim-top" />
            <div className="scrim-bottom" />
          </section>
        )
      })}
    </div>
  )
}

interface SlideVideoProps {
  model: Model
  result: Color
  preload: 'auto' | 'metadata'
  idlePlaying: boolean
  revealShown: boolean
  revealPlaying: boolean
  onRevealEnd?: () => void
}

// Idle loop while betting; the result's reveal video sits underneath, buffered, and fades in when
// the round locks. It stays on its last frame through the result screen.
function SlideVideo({ model, result, preload, idlePlaying, revealShown, revealPlaying, onRevealEnd }: SlideVideoProps) {
  const idle = useRef<HTMLVideoElement>(null)
  const reveal = useRef<HTMLVideoElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const v = idle.current
    if (!v) return
    if (idlePlaying) v.play().catch(() => {})
    else v.pause()
  }, [idlePlaying])

  useEffect(() => {
    const v = reveal.current
    if (!v) return
    if (revealPlaying) {
      if (!started.current) {
        started.current = true
        v.currentTime = 0
      }
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [revealPlaying])

  // A new reveal clip (ambassador switch before the round played) starts fresh
  useEffect(() => { started.current = false }, [model.id, result])

  return (
    <>
      <video
        ref={reveal}
        className={`clip clip-reveal ${revealShown ? 'is-shown' : ''}`}
        src={model.reveal[result]}
        muted
        playsInline
        preload={preload}
        onEnded={onRevealEnd}
      />
      <video
        ref={idle}
        className={`clip clip-idle ${revealShown ? 'is-hidden' : ''}`}
        src={model.idle}
        aria-label={`${model.name}, ${model.age}`}
        muted
        playsInline
        loop
        preload={preload}
      />
    </>
  )
}

export function ModelInfo({ round, phase, ambassador }: { round: number; phase: Phase; ambassador: string | null }) {
  const { model } = roundInfo(round, ambassador)
  return (
    <div key={round} className={`model-info ${phase === 'advancing' ? 'is-leaving' : ''}`}>
      <div className="model-name">{model.name}, {model.age}</div>
      <div className="model-city"><PinIcon /> {model.city}</div>
    </div>
  )
}
