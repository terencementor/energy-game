import { GameProvider } from './context/GameContext'
import GameBoard from './components/GameBoard'
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
      </div>
    </GameProvider>
  )
}

export default App
