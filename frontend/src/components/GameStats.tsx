import React from 'react'
import { useGame } from '../context/GameContext'
import './GameStats.css'

const GameStats: React.FC = () => {
  const { gameState, startGame, setSpeed, restartGame } = useGame()

  const hours = String(gameState.currentHour).padStart(2, '0')
  const getPeriod = () => {
    if (gameState.currentHour >= 8 && gameState.currentHour < 17) return 'Day'
    return 'Night'
  }

  // Calculate population based on current day (increases by 1000 every 5 days)
  const population = 10000 + Math.floor(gameState.currentDay / 5) * 1000

  const powerPercentage = (gameState.powerGenerated / gameState.powerRequired) * 100
  const powerStatus = gameState.powerGenerated >= gameState.powerRequired ? 'sufficient' : 'deficit'
  const requiredPct = 100 // visual bar is static full-width; actual numbers shown below

  return (
    <div className="game-stats">
      <div className="stats-row">
        <div className="stat-box">
          <label>Day</label>
          <div className="value">{gameState.currentDay + 1}/30</div>
        </div>
        <div className="stat-box">
          <label>Time</label>
          <div className="value">{hours}:00 {getPeriod()}</div>
        </div>
        <div className="stat-box">
          <label>Budget</label>
          <div className={`value ${gameState.credits < 0 ? 'critical' : 'normal'}`}>
            ₹{gameState.credits.toLocaleString()}
          </div>
        </div>
        <div className="stat-box">
          <label>Population</label>
          <div className="value">{population.toLocaleString()}</div>
        </div>
        <div className="stat-box start-box">
          {!gameState.gameActive ? (
            <button className="start-game-btn" onClick={() => startGame()}>
              Start Game
            </button>
          ) : (
            <div className="value">Running</div>
          )}
        </div>
        <div className="stat-box restart-box">
          <button className="restart-btn" onClick={() => restartGame()}>
            Restart
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box power">
          <label>Required Power</label>
          <div className="required-bar">
            <div className="required-fill" style={{ width: `${requiredPct}%` }}></div>
          </div>
          <div className="required-text">{gameState.powerRequired.toFixed(1)} MW required</div>

          <label>Power Status</label>
          <div className={`power-bar ${powerStatus}`}>
            <div className="power-fill" style={{ width: `${Math.min(powerPercentage, 100)}%` }}></div>
          </div>
          <div className="power-text">
            {gameState.powerGenerated.toFixed(1)} / {gameState.powerRequired.toFixed(1)} MW
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <label>CO₂ Emissions</label>
          <div className="value">{gameState.carbonDioxideTotal.toFixed(0)} units</div>
        </div>
        <div className="stat-box">
          <label>Active Units</label>
          <div className="value">{gameState.energyUnits.filter(u => u.isRunning).length}/{gameState.energyUnits.length}</div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <label>Game Speed</label>
          <div className="speed-buttons">
            <button onClick={() => setSpeed(0.5)} className={gameState.gameSpeed === 0.5 ? 'active' : ''}>0.5x</button>
            <button onClick={() => setSpeed(1)} className={gameState.gameSpeed === 1 ? 'active' : ''}>1x</button>
            <button onClick={() => setSpeed(2)} className={gameState.gameSpeed === 2 ? 'active' : ''}>2x</button>
            <button onClick={() => setSpeed(4)} className={gameState.gameSpeed === 4 ? 'active' : ''}>4x</button>
          </div>
          <div className="current-speed">Current: {gameState.gameSpeed}x</div>
        </div>
      </div>
    </div>
  )
}

export default GameStats
