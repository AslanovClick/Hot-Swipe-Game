import { useRef } from 'react'
import { sceneFor } from '../game/scenes'
import type { Phase } from '../game/useGame'
import { PinIcon } from './icons'

interface Props {
  round: number
  phase: Phase
  ambassador: string | null
  onSwipeNext: () => void
}

// Slides are keyed by absolute round number so the outgoing and incoming slides animate as one strip
export function Feed({ round, phase, ambassador, onSwipeNext }: Props) {
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
        const scene = sceneFor(ambassador, abs)
        const pos = abs - round - offset
        const revealed = abs < round || (abs === round && phase !== 'betting')
        return (
          <section
            key={abs}
            className={`slide ${abs === round ? 'is-current' : ''} ${abs === round && phase === 'reveal' ? 'is-revealing' : ''}`}
            style={{ transform: `translate3d(0, ${pos * 100}%, 0)` }}
            aria-hidden={abs !== round}
          >
            <img className="photo photo-after" src={scene.after} alt="" draggable={false} />
            <img
              className={`photo photo-before ${revealed ? 'is-hidden' : ''}`}
              src={scene.before}
              alt={`${scene.name}, ${scene.age}`}
              draggable={false}
            />
            <div className="reveal-sweep" />
            <div className="scrim-top" />
            <div className="scrim-bottom" />
          </section>
        )
      })}
    </div>
  )
}

export function ModelInfo({ round, phase, ambassador }: { round: number; phase: Phase; ambassador: string | null }) {
  const scene = sceneFor(ambassador, round)
  return (
    <div key={round} className={`model-info ${phase === 'advancing' ? 'is-leaving' : ''}`}>
      <div className="model-name">{scene.name}, {scene.age}</div>
      <div className="model-city"><PinIcon /> {scene.city}</div>
    </div>
  )
}
