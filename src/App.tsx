import { useState } from 'react'
import { AmbassadorSheet } from './components/AmbassadorSheet'
import { BetPanel, SceneHud } from './components/Controls'
import { Feed } from './components/Feed'
import { Header } from './components/Header'
import { HistorySheet } from './components/HistorySheet'
import { ShieldIcon } from './components/icons'
import { Menu, type Prefs } from './components/Menu'
import { EMPTY_PREFERENCES, Onboarding, sanitizePreferences, type Preferences } from './components/Onboarding'
import { ResultCard } from './components/ResultCard'
import { RulesSheet } from './components/RulesSheet'
import { StatsSheet } from './components/StatsSheet'
import { useGame } from './game/useGame'

type Sheet = 'menu' | 'rules' | 'ambassadors' | 'history' | 'stats' | null

const ONBOARDING_KEY = 'hotswipe.preferences.v2'

function loadPreferences(): Preferences | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY)
    return raw ? sanitizePreferences(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export default function App() {
  const [sheet, setSheet] = useState<Sheet>(null)
  // Preferences run before the game until finished or skipped once, and can be reopened from the menu
  const [preferences, setPreferences] = useState<Preferences | null>(loadPreferences)
  const [prefsScreen, setPrefsScreen] = useState<'first' | 'edit' | null>(preferences === null ? 'first' : null)
  const paused = sheet !== null || prefsScreen !== null
  const { state, dispatch } = useGame(paused)
  const { phase, outcome } = state
  const close = () => setSheet(null)

  // Menu switches are clickable but don't drive any behavior yet
  const [prefs, setPrefs] = useState<Prefs>({ audio: true, animation: true, quickBet: false })

  const savePreferences = (p: Preferences) => {
    setPreferences(p)
    setPrefsScreen(null)
    try { localStorage.setItem(ONBOARDING_KEY, JSON.stringify(p)) } catch { /* storage unavailable */ }
  }

  const delta = phase === 'result' || (phase === 'advancing' && outcome) ? outcome?.payout ?? null : null

  return (
    <div className="app">
      <main className="phone">
        <section className={`stage ${phase === 'reveal' ? 'is-revealing' : ''}`}>
          <Feed
            round={state.round}
            phase={phase}
            ambassador={state.ambassador}
            highRisk={state.highRisk}
            hasBet={state.bet !== null}
            paused={paused}
            onSwipeNext={() => dispatch({ type: 'next' })}
            onRevealEnd={() => dispatch({ type: 'revealEnded' })}
          />
          <SceneHud state={state} />

          {outcome && (phase === 'result' || phase === 'advancing') && (
            <ResultCard key={state.round} outcome={outcome} leaving={phase === 'advancing'} />
          )}

          <div className={`dock ${phase === 'reveal' ? 'is-compact' : ''}`}>
            <BetPanel
              state={state}
              onPick={color => dispatch({ type: 'pick', color })}
              onStake={stake => dispatch({ type: 'setStake', stake })}
              onHighRisk={on => dispatch({ type: 'setHighRisk', on })}
              onAutoBet={on => dispatch({ type: 'setAutoBet', on })}
            />
            <div className="trust"><ShieldIcon /> Virtual coins only</div>
          </div>
        </section>

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

        {sheet === 'menu' && (
          <Menu
            balance={state.balance}
            prefs={prefs}
            onPref={(key, value) => setPrefs(p => ({ ...p, [key]: value }))}
            onRules={() => setSheet('rules')}
            onHistory={() => setSheet('history')}
            onStats={() => setSheet('stats')}
            onPreferences={() => { close(); setPrefsScreen('edit') }}
            onReset={() => dispatch({ type: 'resetBalance' })}
            onClose={close}
          />
        )}
        {sheet === 'rules' && <RulesSheet onClose={close} />}
        {sheet === 'history' && <HistorySheet history={state.history} onClose={close} />}
        {sheet === 'stats' && <StatsSheet history={state.history} onClose={close} />}
        {sheet === 'ambassadors' && (
          <AmbassadorSheet
            current={state.ambassador}
            stake={state.stake}
            onSelect={id => { dispatch({ type: 'setAmbassador', id }); close() }}
            onClose={close}
          />
        )}
        {prefsScreen && (
          <Onboarding
            mode={prefsScreen}
            initial={preferences ?? EMPTY_PREFERENCES}
            onDone={savePreferences}
            onClose={() => setPrefsScreen(null)}
          />
        )}
      </main>
    </div>
  )
}
