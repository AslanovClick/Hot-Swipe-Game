import { useMemo, useState } from 'react'
import { COLORS, MULTIPLIERS, STAKE_STEPS, type Color } from '../game/config'
import type { Outcome } from '../game/useGame'
import { formatCoins } from './Header'
import { CloseIcon } from './icons'

interface Row {
  id: string
  player: string
  you: boolean
  stake: number
  color: Color
  won: boolean
  payout: number
}

type Tab = 'all' | 'my' | 'top'

// Placeholder crowd so All / Top look alive until there's a backend
const NAMES = ['idfinn', 'lucky_mo', 'kira77', 'jaxon', 'nika.v', 'tomasz', 'sunny_b', 'rafa_k', 'eli.m', 'dmitr0', 'zoe_x', 'marco']
// Integer hash (mulberry32 step) -> [0, 1); stable per seed so rows don't reshuffle
const rand = (seed: number) => {
  let t = (Math.imul(seed, 0x9e3779b9) + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function botsFor(round: number, result: Color): Row[] {
  return Array.from({ length: 3 }, (_, k) => {
    const seed = round * 101 + k * 7
    const color = COLORS[Math.floor(rand(seed) * 3)]
    const stake = STAKE_STEPS[1 + Math.floor(rand(seed + 1000) * 5)]
    const won = color === result
    return {
      id: `b${round}-${k}`,
      player: NAMES[Math.floor(rand(seed + 2000) * NAMES.length)],
      you: false,
      stake,
      color,
      won,
      payout: won ? stake * MULTIPLIERS[color] : 0,
    }
  })
}

export function HistorySheet({ history, onClose }: { history: Outcome[]; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('all')

  const rows = useMemo(() => {
    const mine: Row[] = history.flatMap((o, i) => o.bet ? [{
      id: `y${history.length - i}`,
      player: 'You',
      you: true,
      stake: o.bet.stake,
      color: o.bet.color,
      won: o.payout > 0,
      payout: o.payout,
    }] : [])
    const all: Row[] = history.flatMap((o, i) => {
      const round = history.length - i
      const me = mine.find(r => r.id === `y${round}`)
      return [...(me ? [me] : []), ...botsFor(round, o.result)]
    })
    if (tab === 'my') return mine
    if (tab === 'top') return all.filter(r => r.won).sort((a, b) => b.payout - a.payout).slice(0, 20)
    return all
  }, [history, tab])

  const total = rows.reduce((sum, r) => sum + r.payout, 0)

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet history-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="History">
        <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        <div className="sheet-title">History</div>

        <div className="tabs" role="tablist">
          {(['all', 'my', 'top'] as Tab[]).map(t => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'is-active' : ''} onClick={() => setTab(t)}>
              {t === 'all' ? 'All' : t === 'my' ? 'My' : 'Top'}
            </button>
          ))}
        </div>

        <div className="hist-total">
          <span>Total won</span>
          <b>{formatCoins(total)} coins</b>
        </div>

        <div className="hist-list">
          {rows.length === 0 ? (
            <div className="hist-empty">{tab === 'my' ? 'Your bets will show up here' : 'Play a round to see bets here'}</div>
          ) : rows.map(r => (
            <div key={r.id} className={`hist-row ${r.you ? 'is-you' : ''} ${r.won ? 'is-won' : ''}`}>
              <span className="hist-player">{r.player}</span>
              <span className="hist-stake">{formatCoins(r.stake)}</span>
              <span className={`hchip ${r.won ? 'is-win' : 'is-lose'} c-${r.color}`}>{MULTIPLIERS[r.color].toFixed(2)}</span>
              <span className="hist-payout">{r.won ? `+${formatCoins(r.payout)}` : '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
