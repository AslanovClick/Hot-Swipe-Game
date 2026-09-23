import { useEffect, useState } from 'react'
import { BetSheet } from './components/BetSheet'
import { BetPanel, SceneHud } from './components/Controls'
import { Feed } from './components/Feed'
import { Header } from './components/Header'
import { ShieldIcon } from './components/icons'
import { Menu } from './components/Menu'
import { ResultCard } from './components/ResultCard'
import { RulesSheet } from './components/RulesSheet'
import { SCENES } from './game/scenes'
import { useGame } from './game/useGame'

type Sheet = 'menu' | 'stake' | 'rules' | null

export default function App() {
  const [sheet, setSheet] = useState<Sheet>(null)
  const { state, dispatch } = useGame(sheet !== null)
  const { phase, outcome } = state
  const close = () => setSheet(null)

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
          onMenu={() => setSheet('menu')}
          onInfo={() => setSheet('rules')}
        />

        <section className="stage">
          <Feed round={state.round} phase={phase} onSwipeNext={() => dispatch({ type: 'next' })} />
          <SceneHud state={state} />

          {outcome && (phase === 'result' || phase === 'advancing') && (
            <ResultCard key={state.round} outcome={outcome} leaving={phase === 'advancing'} />
          )}

          <div className="dock">
            <BetPanel
              state={state}
              onPick={color => dispatch({ type: 'pick', color })}
              onBet={() => dispatch({ type: 'placeBet' })}
              onNext={() => dispatch({ type: 'next' })}
              onStake={stake => dispatch({ type: 'setStake', stake })}
              onOpenStake={() => setSheet('stake')}
            />
            <div className="trust"><ShieldIcon /> Virtual coins only</div>
            <div className="history-panel" aria-label="History" />
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
        {sheet === 'menu' && <Menu onClose={close} onReset={() => dispatch({ type: 'resetBalance' })} />}
        {sheet === 'rules' && <RulesSheet onClose={close} />}
      </main>
    </div>
  )
}
