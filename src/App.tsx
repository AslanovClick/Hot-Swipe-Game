import { useEffect, useState } from 'react'
import { BetSheet } from './components/BetSheet'
import { Controls } from './components/Controls'
import { Feed } from './components/Feed'
import { Header } from './components/Header'
import { Menu } from './components/Menu'
import { ResultCard } from './components/ResultCard'
import { SCENES } from './game/scenes'
import { useGame } from './game/useGame'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [stakeOpen, setStakeOpen] = useState(false)
  const { state, dispatch } = useGame(menuOpen || stakeOpen)
  const { phase, outcome } = state

  useEffect(() => {
    for (const s of SCENES) { new Image().src = s.before; new Image().src = s.after }
  }, [])

  const delta = phase === 'result' || phase === 'advancing' ? outcome?.payout ?? null : null

  return (
    <div className="app">
      <main className="phone">
        <Feed round={state.round} phase={phase} onSwipeNext={() => dispatch({ type: 'next' })} />

        <Header balance={state.balance} delta={delta} onMenu={() => setMenuOpen(true)} />

        {outcome && (phase === 'result' || phase === 'advancing') && (
          <ResultCard key={state.round} outcome={outcome} leaving={phase === 'advancing'} />
        )}

        <Controls
          state={state}
          onPick={color => dispatch({ type: 'pick', color })}
          onBet={() => dispatch({ type: 'placeBet' })}
          onNext={() => dispatch({ type: 'next' })}
          onStake={stake => dispatch({ type: 'setStake', stake })}
          onOpenStake={() => setStakeOpen(true)}
        />

        {stakeOpen && (
          <BetSheet
            stake={state.stake}
            balance={state.balance}
            onClose={() => setStakeOpen(false)}
            onApply={stake => { dispatch({ type: 'setStake', stake }); setStakeOpen(false) }}
          />
        )}

        {menuOpen && <Menu onClose={() => setMenuOpen(false)} onReset={() => dispatch({ type: 'resetBalance' })} />}
      </main>
    </div>
  )
}
