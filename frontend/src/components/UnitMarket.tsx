import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import './UnitMarket.css'

const UnitMarket: React.FC = () => {
  const { gameState, unitTypes, buyUnit, isLoading } = useGame()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'fossil', name: 'Fossil Fuels', types: ['engine', 'turbine', 'coal'] },
    { id: 'renewable', name: 'Renewable', types: ['solar', 'wind'] },
    { id: 'advanced', name: 'Advanced', types: ['nuclear'] },
  ]

  const getCategory = (typeId: string) => {
    return categories.find(cat => cat.types.includes(typeId))
  }

  const handleBuy = (typeId: string) => {
    buyUnit(typeId)
  }

  return (
    <div className="unit-market">
      <h2>Energy Market</h2>
      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="units-market">
        {unitTypes
          .filter((type) => {
            // Hide battery before day 10
            if (type.id === 'battery' && gameState.currentDay < 10) return false
            if (!selectedCategory) return true
            const category = getCategory(type.id)
            return category?.id === selectedCategory
          })
          .map((type) => {
            const canAfford = gameState.credits >= type.cost
            const category = getCategory(type.id)

            return (
              <div key={type.id} className={`market-unit ${!canAfford ? 'unaffordable' : ''}`}>
                <div className="unit-name">
                  <h3>{type.name}</h3>
                  <p className="max-output">{type.maxMw} MW</p>
                  {category && <p className="category">{category.name}</p>}
                </div>

                <div className="unit-specs">
                  <div className="spec">
                    <span>Max Output</span>
                    <strong>{type.maxMw} MW</strong>
                  </div>
                  {type.timeToFullPower > 0 && (
                    <div className="spec">
                      <span>Startup Time</span>
                      <strong>{type.timeToFullPower}h</strong>
                    </div>
                  )}
                  <div className="spec">
                    <span>Running Cost</span>
                    <strong>₹{type.runningCostPerHour}/h</strong>
                  </div>
                  <div className="spec">
                    <span>CO₂ Output</span>
                    <strong>{type.carbonDioxidePerHour}/h</strong>
                  </div>
                  {type.availableHours && (
                    <div className="spec">
                      <span>Available</span>
                      <strong>{type.availableHours[0]}:00-{type.availableHours[1]}:00</strong>
                    </div>
                  )}
                  {type.unpredictable && (
                    <div className="spec warning">
                      <span>Unpredictable</span>
                      <strong>⚠️ Variable Output</strong>
                    </div>
                  )}
                </div>

                <button
                  className={`buy-btn ${!canAfford ? 'disabled' : ''}`}
                  onClick={() => handleBuy(type.id)}
                  disabled={!canAfford || isLoading}
                >
                  <div>₹{type.cost.toLocaleString()}</div>
                  <div className="btn-label">{canAfford ? 'BUY' : 'TOO EXPENSIVE'}</div>
                </button>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default UnitMarket
