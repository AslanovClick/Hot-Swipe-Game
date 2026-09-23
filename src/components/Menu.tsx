import type { ReactNode } from 'react'
import { AutoIcon, BoltIcon, ResetIcon, StatsIcon } from './icons'

export function Menu({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <nav className="sheet menu" onClick={e => e.stopPropagation()} aria-label="Menu">
        <div className="sheet-handle" />
        <div className="sheet-title">Menu</div>

        <div className="glass menu-group">
          <MenuItem icon={<BoltIcon />} label="High Risk" soon />
          <MenuItem icon={<AutoIcon />} label="Auto mode" soon />
          <MenuItem icon={<StatsIcon />} label="Statistics" soon />
        </div>

        <div className="glass menu-group">
          <MenuItem icon={<ResetIcon />} label="Reset balance" onClick={() => { onReset(); onClose() }} />
        </div>

        <button className="cta menu-close" onClick={onClose}><span className="cta-label">Back to game</span></button>
      </nav>
    </div>
  )
}

function MenuItem({ icon, label, soon, onClick }: { icon: ReactNode; label: string; soon?: boolean; onClick?: () => void }) {
  return (
    <button className="menu-item" onClick={onClick} disabled={soon}>
      <span className="menu-icon">{icon}</span>
      <span>{label}</span>
      {soon && <span className="soon">Soon</span>}
    </button>
  )
}
