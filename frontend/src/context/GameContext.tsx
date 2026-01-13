import React, { createContext, useContext, useState, useEffect } from 'react'

export interface EnergyUnit {
  id: string
  typeId: string
  isRunning: boolean
  powerOutput: number
  hoursRunning: number
  chargePercent?: number
  totalCost: number
  startTime?: number
}

export interface EnergyUnitType {
  id: string
  name: string
  cost: number
  startupCost: number
  timeToFullPower: number
  runningCostPerHour: number
  carbonDioxidePerHour: number
  minMw: number
  maxMw: number
  availableHours?: [number, number]
  unpredictable?: boolean
  isBattery?: boolean
}

export interface GameState {
  id: string
  budget: number
  credits: number
  currentHour: number
  currentDay: number
  gameActive: boolean
  gameSpeed: number
  energyUnits: EnergyUnit[]
  powerRequired: number
  powerGenerated: number
  carbonDioxideTotal: number
  notifications: Array<{ id: string; message: string; type: 'info' | 'warning' | 'success'; timestamp: number }>
}

interface GameContextType {
  gameState: GameState
  unitTypes: EnergyUnitType[]
  buyUnit: (typeId: string) => Promise<boolean>
  toggleUnit: (unitId: string) => Promise<boolean>
  startGame: () => Promise<boolean>
  setSpeed: (speed: number) => Promise<boolean>
  restartGame: () => Promise<boolean>
  isLoading: boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const API_URL = 'http://localhost:3000/api'

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    id: 'default',
    budget: 1000000,
    credits: 1000000,
    currentHour: 6,
    currentDay: 0,
    gameActive: true,
    gameSpeed: 1,
    energyUnits: [],
    powerRequired: 0,
    powerGenerated: 0,
    carbonDioxideTotal: 0,
  })

  const [unitTypes, setUnitTypes] = useState<EnergyUnitType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stateRes, unitsRes] = await Promise.all([
          fetch(`${API_URL}/game/state`),
          fetch(`${API_URL}/game/units`),
        ])

        if (stateRes.ok) setGameState(await stateRes.json())
        if (unitsRes.ok) setUnitTypes(await unitsRes.json())
      } catch (err) {
        console.error('Failed to fetch game data:', err)
      }
    }

    fetchData()
  }, [])

  // Game loop - 1 real second = 1 in-game hour (adjust as needed)
  useEffect(() => {
    if (!gameState.gameActive) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/game/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameId: 'default' }),
        })

        if (res.ok) {
          setGameState(await res.json())
        }
      } catch (err) {
        console.error('Failed to update game:', err)
      }
    }, 5000) // 5 seconds per hour

    return () => clearInterval(interval)
  }, [gameState.gameActive])

  const buyUnit = async (typeId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/game/buy-unit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 'default', typeId }),
      })

      if (res.ok) {
        const data = await res.json()
        setGameState(data.state)
        return data.success
      }
      return false
    } catch (err) {
      console.error('Failed to buy unit:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUnit = async (unitId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/game/toggle-unit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 'default', unitId }),
      })

      if (res.ok) {
        const data = await res.json()
        setGameState(data.state)
        return data.success
      }
      return false
    } catch (err) {
      console.error('Failed to toggle unit:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const startGame = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/game/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 'default' }),
      })

      if (res.ok) {
        const data = await res.json()
        setGameState(data.state)
        return data.success
      }
      return false
    } catch (err) {
      console.error('Failed to start game:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const setSpeed = async (speed: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/game/set-speed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 'default', speed }),
      })

      if (res.ok) {
        const data = await res.json()
        setGameState(data.state)
        return data.success
      }
      return false
    } catch (err) {
      console.error('Failed to set speed:', err)
      return false
    }
  }

  const restartGame = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/game/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: 'default' }),
      })

      if (res.ok) {
        const data = await res.json()
        setGameState(data.state)
        return data.success
      }
      return false
    } catch (err) {
      console.error('Failed to restart game:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GameContext.Provider value={{ gameState, unitTypes, buyUnit, toggleUnit, startGame, setSpeed, restartGame, isLoading }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
