import React from 'react'
import { useGame } from '../context/GameContext'
import UnitControl from './UnitControl'
import UnitMarket from './UnitMarket'
import GameStats from './GameStats'
import './GameBoard.css'

const GameBoard: React.FC = () => {
  const { gameState } = useGame()

  if (!gameState.gameActive && gameState.currentDay > 0) {
    return (
      <div className="game-board">
        <div className="game-over">
          <h2>Game Over - Month Complete!</h2>
          <div className="final-stats">
            <div className="stat-box">
              <span>Final Credits:</span>
              <strong className={gameState.credits < 0 ? 'negative' : 'positive'}>
                {gameState.credits.toLocaleString()}
              </strong>
            </div>
            <div className="stat-box">
              <span>Total CO2 Emissions:</span>
              <strong>{gameState.carbonDioxideTotal.toFixed(2)} units</strong>
            </div>
            <div className="stat-box">
              <span>Days Survived:</span>
              <strong>{gameState.currentDay}</strong>
            </div>
          </div>
          <button onClick={() => location.reload()}>Play Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-board">
      <GameStats />
      
      <div className="main-content">
        <div className="left-panel">
          <UnitControl />
        </div>
        <div className="right-panel">
          <UnitMarket />
        </div>
      </div>
    </div>
  )
}

export default GameBoard
