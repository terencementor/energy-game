import React from 'react'
import { useGame } from '../context/GameContext'
import './UnitControl.css'

const UnitControl: React.FC = () => {
  const { gameState, unitTypes, toggleUnit, isLoading } = useGame()

  const getUnitTypeName = (typeId: string): string => {
    const type = unitTypes.find(t => t.id === typeId)
    return type?.name || typeId
  }

  const getUnitTypeInfo = (typeId: string) => {
    return unitTypes.find(t => t.id === typeId)
  }

  if (gameState.energyUnits.length === 0) {
    return (
      <div className="unit-control">
        <h2>Your Power Plants</h2>
        <p className="empty-message">No power plants purchased yet. Visit the market on the right!</p>
      </div>
    )
  }

  // Group units by type
  const groupedUnits = gameState.energyUnits.reduce(
    (acc, unit) => {
      if (!acc[unit.typeId]) {
        acc[unit.typeId] = []
      }
      acc[unit.typeId].push(unit)
      return acc
    },
    {} as Record<string, typeof gameState.energyUnits>
  )

  // Sort groups by type ID for consistent ordering
  const sortedTypeIds = Object.keys(groupedUnits).sort()

  return (
    <div className="unit-control">
      <h2>Your Power Plants ({gameState.energyUnits.length})</h2>
      <div className="units-list">
        {sortedTypeIds.map((typeId) => (
          <div key={typeId} className="unit-group">
            <div className="unit-group-header">{getUnitTypeName(typeId)}</div>
            <div className="unit-group-cards">
            {groupedUnits[typeId].map((unit) => {
              const typeInfo = getUnitTypeInfo(unit.typeId)
              if (!typeInfo) return null

              const isRampingUp = unit.hoursRunning < typeInfo.timeToFullPower && unit.isRunning
              const rampUpPercent = typeInfo.timeToFullPower > 0 ? (unit.hoursRunning / typeInfo.timeToFullPower) * 100 : 100

              return (
                <div key={unit.id} className={`unit-card ${unit.isRunning ? 'running' : 'idle'}`}>
                  <div className="unit-header">
                    <button
                      className={`toggle-btn ${unit.isRunning ? 'stop' : 'start'}`}
                      onClick={() => toggleUnit(unit.id)}
                      disabled={isLoading}
                    >
                      {unit.isRunning ? 'STOP' : 'START'}
                    </button>
                  </div>

                  <div className="unit-stats">
                    <div className="stat">
                      <span>Current Output</span>
                      <strong>{unit.powerOutput.toFixed(1)} MW</strong>
                    </div>
                    <div className="stat">
                      <span>Hours Running</span>
                      <strong>{unit.hoursRunning}h</strong>
                    </div>
                    {typeInfo.id === 'battery' && unit.chargePercent !== undefined && (
                      <div className="stat">
                        <span>Charge</span>
                        <strong>{Math.round(unit.chargePercent)}%</strong>
                      </div>
                    )}
                    {isRampingUp && (
                      <div className="stat">
                        <span>Ramp-up</span>
                        <div className="rampup-bar">
                          <div className="rampup-fill" style={{ width: `${rampUpPercent}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UnitControl
