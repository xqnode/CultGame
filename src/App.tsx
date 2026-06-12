import { EndingScreen } from './components/EndingScreen'
import { GameScreen } from './components/GameScreen'
import { RootRevealScreen } from './components/RootRevealScreen'
import { StartScreen } from './components/StartScreen'
import { useGame } from './hooks/useGame'

export default function App() {
  const { session, soundOn, startGame, confirmRoot, choose, restart, toggleSound } = useGame()

  if (!session) {
    return <StartScreen onStart={startGame} soundOn={soundOn} onToggleSound={toggleSound} />
  }

  if (session.phase === 'root_reveal') {
    return <RootRevealScreen session={session} onConfirm={confirmRoot} />
  }

  if (session.phase === 'ending') {
    return <EndingScreen session={session} onRestart={restart} />
  }

  return (
    <GameScreen
      session={session}
      onChoose={choose}
      soundOn={soundOn}
      onToggleSound={toggleSound}
    />
  )
}
