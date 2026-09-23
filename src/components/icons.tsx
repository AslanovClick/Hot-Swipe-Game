export const CoinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <defs>
      <linearGradient id="coin-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe27a" />
        <stop offset="1" stopColor="#e9a412" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#coin-g)" />
    <circle cx="12" cy="12" r="8" fill="none" stroke="#b97a06" strokeWidth="1.4" opacity=".7" />
    <path d="M14.6 9.3c-.5-.8-1.5-1.2-2.6-1.2-1.5 0-2.6.8-2.6 1.9 0 2.6 5.4 1.3 5.4 3.9 0 1.1-1.2 2-2.8 2-1.2 0-2.2-.5-2.7-1.3M12 6.6v1.5M12 15.9v1.5"
      fill="none" stroke="#9a6203" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export const HeartIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"
      fill="currentColor" />
  </svg>
)

export const BurgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

export const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="currentColor" />
  </svg>
)

export const CheckIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M13.5 2L4 14h6.5L9.5 22 20 9.5h-6.8L13.5 2z" fill="currentColor" />
  </svg>
)

export const AutoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
  </svg>
)

export const StatsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M5 20v-5M10 20v-9M15 20V7M20 20V4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
)

export const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M12 10.5v6.5M12 7v.01" stroke="#1a1226" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
)

export const WalletIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18v3H6.5a.5.5 0 0 0 0 1H20v11a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 17.5v-11z" fill="currentColor" />
    <circle cx="16.5" cy="14" r="1.4" fill="#1a1226" />
  </svg>
)

export const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
    <path fillRule="evenodd" fill="currentColor"
      d="M10.3 2h3.4l.5 2.6 1.6.7 2.2-1.5 2.4 2.4-1.5 2.2.7 1.6 2.6.5v3.4l-2.6.5-.7 1.6 1.5 2.2-2.4 2.4-2.2-1.5-1.6.7-.5 2.6h-3.4l-.5-2.6-1.6-.7-2.2 1.5-2.4-2.4 1.5-2.2-.7-1.6L2 13.7v-3.4l2.6-.5.7-1.6-1.5-2.2 2.4-2.4 2.2 1.5 1.6-.7.5-2.6zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  </svg>
)

export const HistoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4 4.5V8h3.5M12 8v4.5l3 2" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 2l8 3v6.5c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5V5l8-3z" fill="currentColor" />
    <path d="M8.5 12l2.5 2.5 4.5-5" stroke="#1a1226" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const LockIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <rect x="4.5" y="10" width="15" height="11" rx="3" fill="currentColor" />
    <circle cx="12" cy="15.5" r="1.6" fill="#1a1226" />
  </svg>
)

export const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

export const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15zM5 19.5A1.5 1.5 0 0 0 6.5 21H19" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
  </svg>
)

export const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="16" cy="7" r="2.3" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="8" cy="17" r="2.3" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
)

export const SpeakerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
)

export const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" fill="currentColor" />
  </svg>
)

export const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 17v.01" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
)
