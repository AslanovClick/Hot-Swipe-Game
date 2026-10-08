import { useState } from 'react'
import { AmbassadorSheet } from './components/AmbassadorSheet'
import { BetPanel, SceneHud } from './components/Controls'
import { Feed } from './components/Feed'
import { Header } from './components/Header'
import { HistorySheet } from './components/HistorySheet'
import { ShieldIcon } from './components/icons'
import { Menu, type Prefs } from './components/Menu'
import { describePreferences, EMPTY_PREFERENCES, Onboarding, sanitizePreferences, type Preferences } from './components/Onboarding'
import { ResultCard } from './components/ResultCard'
import { RulesSheet } from './components/RulesSheet'
import { StatsSheet } from './components/StatsSheet'
import { useMusic } from './game/music'
import { hasPreferences, setLineupPreferences } from './game/scenes'
import { useGame } from './game/useGame'

type Sheet = 'menu' | 'rules' | 'ambassadors' | 'history' | 'stats' | null

const ONBOARDING_KEY = 'hotswipe.preferences.v2'
const SETTINGS_KEY = 'hotswipe.settings'
const DEFAULT_SETTINGS: Prefs = { audio: true, animation: true, quickBet: false }

function loadSettings(): Prefs {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function loadPreferences(): Preferences | null {
  let prefs: Preferences | null = null
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY)
    prefs = raw ? sanitizePreferences(JSON.parse(raw)) : null
  } catch { /* storage unavailable */ }
  // Saved preferences tune the feed from the very first round
  setLineupPreferences(prefs, 0)
  return prefs
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

  // Menu switches: background music, motion, and quick bet (a tap on a color places the bet at once)
  const [prefs, setPrefs] = useState<Prefs>(loadSettings)
  const setPref = (key: keyof Prefs, value: boolean) => setPrefs(p => {
    const next = { ...p, [key]: value }
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
    return next
  })
  useMusic(prefs.audio)

  // New preferences take over the current scene if it hasn't been played yet (fresh timer),
  // otherwise from the next round on; scenes already shown never change
  const savePreferences = (p: Preferences) => {
    setPreferences(p)
    setPrefsScreen(null)
    try { localStorage.setItem(ONBOARDING_KEY, JSON.stringify(p)) } catch { /* storage unavailable */ }
    const now = phase === 'betting'
    setLineupPreferences(p, now ? state.round : state.round + (phase === 'advancing' ? 2 : 1))
    if (now && !state.ambassador) dispatch({ type: 'restartBetting' })
  }

  const delta = phase === 'result' || (phase === 'advancing' && outcome) ? outcome?.payout ?? null : null

  return (
    <div className={`app ${prefs.animation ? '' : 'is-still'}`}>
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
              onPick={color => dispatch({ type: 'pick', color, quick: prefs.quickBet })}
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
            onPref={setPref}
            onRules={() => setSheet('rules')}
            onHistory={() => setSheet('history')}
            onStats={() => setSheet('stats')}
            preferences={hasPreferences(preferences) ? describePreferences(preferences) : null}
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
