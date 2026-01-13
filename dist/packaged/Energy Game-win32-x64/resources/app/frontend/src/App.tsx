import { GameProvider } from './context/GameContext'
import GameBoard from './components/GameBoard'
import Notifications from './components/Notifications'
import './App.css'

function App() {
  return (
    <GameProvider>
      <div className="app">
        <header>
          <h1>Energy Game</h1>
          <p>Real-time Economy Simulation</p>
        </header>
        <GameBoard />
        <Notifications />
      </div>
    </GameProvider>
  )
}

export default App
