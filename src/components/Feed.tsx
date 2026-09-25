import { useRef } from 'react'
import { roundInfo } from '../game/scenes'
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
        const { model, background, result } = roundInfo(abs, ambassador)
        const pos = abs - round - offset
        const revealed = abs < round || (abs === round && phase !== 'betting')
        return (
          <section
            key={abs}
            className={`slide ${abs === round ? 'is-current' : ''} ${abs === round && phase === 'reveal' ? 'is-revealing' : ''} ${revealed ? 'is-revealed' : ''}`}
            style={{ transform: `translate3d(0, ${pos * 100}%, 0)` }}
            aria-hidden={abs !== round}
          >
            <img className="photo backdrop" src={background} alt="" draggable={false} />
            <img className="girl girl-after" src={model.states[result]} alt="" draggable={false} />
            <img
              className={`girl girl-before ${revealed ? 'is-hidden' : ''}`}
              src={model.clothe}
              alt={`${model.name}, ${model.age}`}
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
  const { model } = roundInfo(round, ambassador)
  return (
    <div key={round} className={`model-info ${phase === 'advancing' ? 'is-leaving' : ''}`}>
      <div className="model-name">{model.name}, {model.age}</div>
      <div className="model-city"><PinIcon /> {model.city}</div>
    </div>
  )
}
