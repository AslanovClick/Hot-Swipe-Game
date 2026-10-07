import { COLOR_LABEL } from '../game/config'
import { sessionStats, type Outcome } from '../game/useGame'
import { formatCoins } from './Header'
import { CloseIcon, CoinIcon, LayersIcon, StatsIcon, TrophyIcon } from './icons'

// Session statistics: played rounds, winnings, the biggest win and the multipliers the player picked
export function StatsSheet({ history, onClose }: { history: Outcome[]; onClose: () => void }) {
  const stats = sessionStats(history)
  const winRate = stats.rounds ? Math.round((stats.wins / stats.rounds) * 100) : 0

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet stats-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Statistics">
        <button className="sheet-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        <div className="sheet-title">Statistics</div>
        <div className="sheet-sub">This session</div>

        <div className="stat-grid">
          <div className="stat-card is-accent">
            <span className="stat-icon"><CoinIcon size={18} /></span>
            <span className="stat-label">Total won</span>
            <b className="stat-value">{formatCoins(stats.totalWon)}</b>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><TrophyIcon /></span>
            <span className="stat-label">Biggest win</span>
            <b className="stat-value">{formatCoins(stats.biggestWin)}</b>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><LayersIcon /></span>
            <span className="stat-label">Rounds played</span>
            <b className="stat-value">{stats.rounds}</b>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><StatsIcon size={18} /></span>
            <span className="stat-label">Win rate</span>
            <b className="stat-value">{winRate}%</b>
          </div>
        </div>

        <div className="stat-section">Your picks</div>
        {history.length === 0 ? (
          <div className="hist-empty">Place a bet to start your stats</div>
        ) : (
          <div className="picks">
            {history.map((o, i) => (
              <span
                key={history.length - i}
                className={`pick-chip c-${o.bet.color} ${o.payout > 0 ? 'is-win' : ''}`}
                title={`${COLOR_LABEL[o.bet.color]} · ${o.payout > 0 ? `won ${formatCoins(o.payout)}` : 'lost'}`}
              >
                ×{o.bet.mult.toFixed(2)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
