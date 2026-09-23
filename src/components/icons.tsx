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
