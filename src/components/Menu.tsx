import type { ReactNode } from 'react'
import { formatCoins } from './Header'
import {
  BoltIcon, BookIcon, ChevronRightIcon, HelpIcon, HistoryIcon, SlidersIcon, SparkleIcon, SpeakerIcon, StatsIcon, WalletIcon,
} from './icons'
import { Toggle } from './Toggle'

export interface Prefs {
  audio: boolean
  animation: boolean
  quickBet: boolean
}

interface Props {
  balance: number
  prefs: Prefs
  onPref: (key: keyof Prefs, value: boolean) => void
  onRules: () => void
  onHistory: () => void
  onPreferences: () => void
  onSoon: (label: string) => void
  onReset: () => void
  onClose: () => void
}

export function Menu({ balance, prefs, onPref, onRules, onHistory, onPreferences, onSoon, onReset, onClose }: Props) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <nav className="sheet menu" onClick={e => e.stopPropagation()} aria-label="Menu">
        <div className="sheet-handle" />

        <div className="menu-balance">
          <span className="menu-icon"><WalletIcon /></span>
          <span className="menu-balance-label">Balance</span>
          <span className="menu-balance-value">{formatCoins(balance)}</span>
          <button className="menu-reset" onClick={onReset}>Reset</button>
        </div>

        <div className="glass menu-group">
          <LinkItem icon={<StatsIcon />} label="Statistics" onClick={() => onSoon('Statistics')} />
          <LinkItem icon={<BookIcon />} label="Game rules" onClick={onRules} />
          <LinkItem icon={<SlidersIcon />} label="Preferences" onClick={onPreferences} />
        </div>

        <div className="glass menu-group">
          <ToggleItem icon={<SpeakerIcon />} label="Audio" checked={prefs.audio} onChange={v => onPref('audio', v)} />
          <ToggleItem icon={<SparkleIcon />} label="Animation" checked={prefs.animation} onChange={v => onPref('animation', v)} />
          <ToggleItem icon={<BoltIcon />} label="Quick bet" checked={prefs.quickBet} onChange={v => onPref('quickBet', v)} />
        </div>

        <div className="glass menu-group">
          <LinkItem icon={<HistoryIcon />} label="History" onClick={onHistory} />
          <LinkItem icon={<HelpIcon />} label="Help" onClick={onRules} />
        </div>

        <button className="glass btn-ghost menu-close" onClick={onClose}>Close</button>
      </nav>
    </div>
  )
}

function LinkItem({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className="menu-item" onClick={onClick}>
      <span className="menu-icon">{icon}</span>
      <span>{label}</span>
      <span className="menu-chevron"><ChevronRightIcon /></span>
    </button>
  )
}

function ToggleItem({ icon, label, checked, onChange }: { icon: ReactNode; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="menu-item">
      <span className="menu-icon">{icon}</span>
      <span>{label}</span>
      <span className="menu-toggle"><Toggle checked={checked} onChange={onChange} /></span>
    </div>
  )
}
