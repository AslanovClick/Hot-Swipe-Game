import type { ReactNode } from 'react'

// All UI icons share one outline style: 24×24 grid, currentColor stroke, round caps/joins.
function Icon({ size = 20, stroke = 2, children }: { size?: number; stroke?: number; children: ReactNode }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" aria-hidden
      fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

type P = { size?: number }

const HEART = 'M12 20.5s-7.5-4.4-9.2-9C1.6 8.2 3.6 4.8 7 4.8c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.4 3.4 4.2 6.7-1.7 4.6-9.2 9-9.2 9z'

export const HeartIcon = ({ size = 16 }: P) => <Icon size={size}><path d={HEART} /></Icon>

// Filled heart for decorative particles only (not a UI icon)
export const HeartSolid = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden><path d={HEART} fill="currentColor" /></svg>
)

export const CoinIcon = ({ size = 18 }: P) => (
  <span className="coin-icon">
    <Icon size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.6 9.4c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.8-2.5 1.9 0 2.5 5.2 1.2 5.2 3.8 0 1.1-1.2 1.9-2.7 1.9-1.2 0-2.1-.5-2.6-1.3M12 6.8v1.4M12 15.8v1.4" />
    </Icon>
  </span>
)

export const PinIcon = ({ size = 12 }: P) => (
  <Icon size={size} stroke={2.4}>
    <path d="M12 21s6.5-5.8 6.5-11a6.5 6.5 0 1 0-13 0c0 5.2 6.5 11 6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Icon>
)

export const CheckIcon = ({ size = 12 }: P) => <Icon size={size} stroke={3.2}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>

export const BoltIcon = ({ size = 16 }: P) => <Icon size={size}><path d="M13.5 2.5L4.5 14h6.5l-1 7.5 9.5-12h-6.5l.5-7z" /></Icon>

export const StatsIcon = ({ size = 16 }: P) => <Icon size={size} stroke={2.4}><path d="M5 20v-5M10 20v-9M15 20V7M20 20V4" /></Icon>

export const InfoIcon = ({ size = 20 }: P) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.8v.01" strokeWidth={2.4} />
  </Icon>
)

export const WalletIcon = ({ size = 20 }: P) => (
  <Icon size={size}>
    <path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3" />
    <path d="M20 8H6a2 2 0 0 1-2-2M21 12v4h-4a2 2 0 0 1 0-4h4z" />
  </Icon>
)

export const GearIcon = ({ size = 20 }: P) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Icon>
)

export const HistoryIcon = ({ size = 20 }: P) => (
  <Icon size={size}><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4 4.5V8h3.5M12 8v4.5l3 2" /></Icon>
)

export const ShieldIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <path d="M12 2.8l7.5 2.8v6c0 4.7-3.2 8.2-7.5 9.9-4.3-1.7-7.5-5.2-7.5-9.9v-6L12 2.8z" />
    <path d="M9 12l2.2 2.2L15.5 10" />
  </Icon>
)

export const LockIcon = ({ size = 20 }: P) => (
  <Icon size={size}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
  </Icon>
)

export const CloseIcon = ({ size = 18 }: P) => <Icon size={size} stroke={2.4}><path d="M6 6l12 12M18 6L6 18" /></Icon>

export const ChevronLeftIcon = ({ size = 18 }: P) => <Icon size={size} stroke={2.4}><path d="M15 6l-6 6 6 6" /></Icon>

export const ChevronRightIcon = ({ size = 16 }: P) => <Icon size={size} stroke={2.4}><path d="M9 6l6 6-6 6" /></Icon>

export const BookIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15zM5 19.5A1.5 1.5 0 0 0 6.5 21H19" />
  </Icon>
)

export const SlidersIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2.2" />
    <circle cx="8" cy="17" r="2.2" />
  </Icon>
)

export const SpeakerIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </Icon>
)

export const SparkleIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <path d="M12 3.5l1.7 5 5 1.7-5 1.7-1.7 5-1.7-5-5-1.7 5-1.7 1.7-5zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" />
  </Icon>
)

export const HelpIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 17v.01" />
  </Icon>
)

export const LockSmallIcon = ({ size = 12 }: P) => (
  <Icon size={size} stroke={2.6}>
    <rect x="5" y="11" width="14" height="9.5" rx="2.5" />
    <path d="M8 11V8.5a4 4 0 0 1 8 0V11" />
  </Icon>
)

export const VerifiedIcon = ({ size = 14 }: P) => (
  <Icon size={size} stroke={2}>
    <path d="M12 2.8l2.3 1.7 2.8-.2.9 2.7 2.3 1.6-.9 2.7.9 2.7-2.3 1.6-.9 2.7-2.8-.2L12 21.2l-2.3-1.7-2.8.2-.9-2.7-2.3-1.6.9-2.7-.9-2.7L6 6.9l.9-2.7 2.8.2L12 2.8z" />
    <path d="M8.8 12.2l2.2 2.2 4.2-4.6" />
  </Icon>
)

export const TrophyIcon = ({ size = 18 }: P) => (
  <Icon size={size}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H5a2.5 2.5 0 0 0 3 4M16 6h3a2.5 2.5 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4" />
  </Icon>
)

export const LayersIcon = ({ size = 18 }: P) => (
  <Icon size={size}>
    <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" />
  </Icon>
)

// Country flags as SVG (emoji flags don't render on Windows)
export const Flag = ({ code, size = 18 }: { code: 'es' | 'us' | 'gb'; size?: number }) => {
  const h = Math.round(size * 0.7)
  return (
    <svg className="flag" width={size} height={h} viewBox="0 0 20 14" aria-hidden>
      <defs>
        <clipPath id={`flag-${code}`}><rect width="20" height="14" rx="2.5" /></clipPath>
      </defs>
      <g clipPath={`url(#flag-${code})`}>
        {code === 'es' && (
          <>
            <rect width="20" height="14" fill="#c60b1e" />
            <rect y="3.5" width="20" height="7" fill="#ffc400" />
          </>
        )}
        {code === 'us' && (
          <>
            <rect width="20" height="14" fill="#fff" />
            {[0, 4, 8, 12].map(y => <rect key={y} y={y} width="20" height="2" fill="#b22234" />)}
            <rect width="9" height="8" fill="#3c3b6e" />
          </>
        )}
        {code === 'gb' && (
          <>
            <rect width="20" height="14" fill="#012169" />
            <path d="M0 0L20 14M20 0L0 14" stroke="#fff" strokeWidth="3" />
            <path d="M0 0L20 14M20 0L0 14" stroke="#c8102e" strokeWidth="1.2" />
            <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4" />
            <path d="M10 0v14M0 7h20" stroke="#c8102e" strokeWidth="2.2" />
          </>
        )}
      </g>
      <rect width="20" height="14" rx="2.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
    </svg>
  )
}

export const RepeatIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <path d="M17 2.5l3 3-3 3M4 11V9.5a4 4 0 0 1 4-4h12M7 21.5l-3-3 3-3M20 13v1.5a4 4 0 0 1-4 4H4" />
  </Icon>
)

export const ClockIcon = ({ size = 16 }: P) => (
  <Icon size={size} stroke={2.4}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2M9.5 2.5h5" />
  </Icon>
)

export const ShuffleIcon = ({ size = 16 }: P) => (
  <Icon size={size}>
    <path d="M16.5 3.5h4v4M3.5 20.5l17-17M20.5 16.5v4h-4M14.5 14.5l6 6M3.5 3.5l5 5" />
  </Icon>
)
