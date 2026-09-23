import { useEffect, useRef, useState } from 'react'
import { AmbassadorSheet } from './components/AmbassadorSheet'
import { BetSheet } from './components/BetSheet'
import { BetPanel, SceneHud } from './components/Controls'
import { Feed } from './components/Feed'
import { Header } from './components/Header'
import { HistorySheet } from './components/HistorySheet'
import { ShieldIcon } from './components/icons'
import { Menu, type Prefs } from './components/Menu'
import { EMPTY_PREFERENCES, Onboarding, type Preferences } from './components/Onboarding'
import { ResultCard } from './components/ResultCard'
import { RulesSheet } from './components/RulesSheet'
import { SCENES } from './game/scenes'
import { useGame } from './game/useGame'

type Sheet = 'menu' | 'stake' | 'rules' | 'ambassadors' | 'history' | null

const ONBOARDING_KEY = 'hotswipe.preferences.v2'

function loadPreferences(): Preferences | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  const [sheet, setSheet] = useState<Sheet>(null)
  // Onboarding shows before the game until the player finishes or skips it once
  const [preferences, setPreferences] = useState<Preferences | null>(loadPreferences)
  const [onboarding, setOnboarding] = useState(preferences === null)
  const { state, dispatch } = useGame(sheet !== null || onboarding)
  const { phase, outcome } = state
  const close = () => setSheet(null)

  // Switches are clickable but don't drive any behavior yet
  const [prefs, setPrefs] = useState<Prefs>({ audio: true, animation: true, quickBet: false })
  const [toggles, setToggles] = useState({ autoBet: false, highRisk: false })

  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef(0)
  const soon = (label: string) => {
    setToast(`${label} — coming soon`)
    clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }

  const finishOnboarding = (p: Preferences) => {
    setPreferences(p)
    setOnboarding(false)
    try { localStorage.setItem(ONBOARDING_KEY, JSON.stringify(p)) } catch { /* storage unavailable */ }
  }

  useEffect(() => {
    for (const s of SCENES) { new Image().src = s.before; new Image().src = s.after }
  }, [])

  const delta = phase === 'result' || phase === 'advancing' ? outcome?.payout ?? null : null

  return (
    <div className="app">
      <main className="phone">
        <Header
          balance={state.balance}
          delta={delta}
          history={state.history}
          ambassador={state.ambassador}
          onMenu={() => setSheet('menu')}
          onInfo={() => setSheet('rules')}
          onAmbassadors={() => setSheet('ambassadors')}
          onHistory={() => setSheet('history')}
        />

        <section className="stage">
          <Feed
            round={state.round}
            phase={phase}
            ambassador={state.ambassador}
            onSwipeNext={() => dispatch({ type: 'next' })}
          />
          <SceneHud state={state} />

          {outcome && (phase === 'result' || phase === 'advancing') && (
            <ResultCard key={state.round} outcome={outcome} leaving={phase === 'advancing'} />
          )}

          {toast && <div key={toast} className="toast">{toast}</div>}

          <div className="dock">
            <BetPanel
              state={state}
              onPick={color => dispatch({ type: 'pick', color })}
              onBet={() => dispatch({ type: 'placeBet' })}
              onNext={() => dispatch({ type: 'next' })}
              onStake={stake => dispatch({ type: 'setStake', stake })}
              onOpenStake={() => setSheet('stake')}
              toggles={toggles}
              onToggle={(key, value) => setToggles(t => ({ ...t, [key]: value }))}
            />
            <div className="trust"><ShieldIcon /> Virtual coins only</div>
          </div>
        </section>

        {sheet === 'stake' && (
          <BetSheet
            stake={state.stake}
            balance={state.balance}
            onClose={close}
            onApply={stake => { dispatch({ type: 'setStake', stake }); close() }}
          />
        )}
        {sheet === 'menu' && (
          <Menu
            balance={state.balance}
            prefs={prefs}
            onPref={(key, value) => setPrefs(p => ({ ...p, [key]: value }))}
            onRules={() => setSheet('rules')}
            onHistory={() => setSheet('history')}
            onPreferences={() => { close(); setOnboarding(true) }}
            onSoon={soon}
            onReset={() => dispatch({ type: 'resetBalance' })}
            onClose={close}
          />
        )}
        {sheet === 'rules' && <RulesSheet onClose={close} />}
        {sheet === 'history' && <HistorySheet history={state.history} onClose={close} />}
        {onboarding && (
          <Onboarding initial={preferences ?? EMPTY_PREFERENCES} onDone={finishOnboarding} />
        )}
        {sheet === 'ambassadors' && (
          <AmbassadorSheet
            current={state.ambassador}
            stake={state.stake}
            onSelect={id => { dispatch({ type: 'setAmbassador', id }); close() }}
            onClose={close}
          />
        )}
      </main>
    </div>
  )
}
