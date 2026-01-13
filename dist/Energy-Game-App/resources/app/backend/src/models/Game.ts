// Energy unit types definition
export interface EnergyUnitType {
  id: string
  name: string
  cost: number
  startupCost: number
  timeToFullPower: number // in hours
  runningCostPerHour: number
  carbonDioxidePerHour: number
  minMw: number
  maxMw: number
  availableHours?: [number, number] // [start, end) for solar (8, 18) = 8am to 6pm
  unpredictable?: boolean
  isBattery?: boolean
}
export interface EnergyUnit {
  id: string
  typeId: string
  isRunning: boolean
  powerOutput: number // current MWh
  hoursRunning: number
  hoursStoppedFor: number // tracks ramp-down time for units that were just stopped
  chargePercent?: number // for batteries: 0-100%
  totalCost: number
  startTime?: number // in-game hour when turned on
}

export interface GameState {
  id: string
  budget: number
  credits: number
  currentHour: number // 0-23
  currentDay: number // 0-29
  gameActive: boolean
  gameSpeed: number // speed multiplier (0.5, 1, 2, 4, etc)
  energyUnits: EnergyUnit[]
  powerRequired: number
  powerGenerated: number
  carbonDioxideTotal: number
  notifications: Array<{ id: string; message: string; type: 'info' | 'warning' | 'success'; timestamp: number }>
  createdAt: Date
  updatedAt: Date
}

const ENERGY_UNIT_TYPES: Record<string, EnergyUnitType> = {
  engine: {
    id: 'engine',
    name: 'Engine',
    cost: 50000,
    startupCost: 5000,
    timeToFullPower: 0,
    runningCostPerHour: 1000,
    carbonDioxidePerHour: 100,
    minMw: 10,
    maxMw: 10,
  },
  turbine: {
    id: 'turbine',
    name: 'Turbine',
    cost: 45000,
    startupCost: 10000,
    timeToFullPower: 3,
    runningCostPerHour: 1000,
    carbonDioxidePerHour: 120,
    minMw: 13,
    maxMw: 13,
  },
  solar: {
    id: 'solar',
    name: 'Solar Panel',
    cost: 500000,
    startupCost: 100,
    timeToFullPower: 0,
    runningCostPerHour: 100,
    carbonDioxidePerHour: 0,
    minMw: 0,
    maxMw: 5,
    availableHours: [8, 18],
  },
  wind: {
    id: 'wind',
    name: 'Wind Turbine',
    cost: 300000,
    startupCost: 200,
    timeToFullPower: 0,
    runningCostPerHour: 3000,
    carbonDioxidePerHour: 0,
    minMw: 0,
    maxMw: 3,
    unpredictable: true,
  },
  coal: {
    id: 'coal',
    name: 'Coal Plant',
    cost: 3000000,
    startupCost: 10000,
    timeToFullPower: 12,
    runningCostPerHour: 1500,
    carbonDioxidePerHour: 300,
    minMw: 0,
    maxMw: 50,
  },
  nuclear: {
    id: 'nuclear',
    name: 'Nuclear Plant',
    cost: 8000000,
    startupCost: 20000,
    timeToFullPower: 24,
    runningCostPerHour: 1500,
    carbonDioxidePerHour: 0,
    minMw: 0,
    maxMw: 80,
  },
  battery: {
    id: 'battery',
    name: 'Battery',
    cost: 100000,
    startupCost: 0,
    timeToFullPower: 0,
    runningCostPerHour: 50,
    carbonDioxidePerHour: 0,
    minMw: 0,
    maxMw: 2,
    isBattery: true, // flag to identify battery type
  },
}

export class Game {
  private state: GameState
  private lastPopulation: number = 0
  private lastDay: number = -1
  private batteryNotificationShown: boolean = false
  private lastCredits: number = 15000000

  constructor(id: string = 'default') {
    this.state = {
      id,
      budget: 15000000,
      credits: 15000000,
      currentHour: 6, // start at 6 AM
      currentDay: 0,
      gameActive: false,
      gameSpeed: 1, // normal speed
      energyUnits: [],
      powerRequired: 0,
      powerGenerated: 0,
      carbonDioxideTotal: 0,
      notifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.calculatePowerRequired()
  }

  startGame(): void {
    this.state.gameActive = true
    this.state.updatedAt = new Date()
  }

  restartGame(): void {
    // Reset game state to initial values
    this.state = {
      id: this.state.id,
      budget: 15000000,
      credits: 15000000,
      currentHour: 6,
      currentDay: 0,
      gameActive: false,
      gameSpeed: 1,
      energyUnits: [],
      powerRequired: 0,
      powerGenerated: 0,
      carbonDioxideTotal: 0,
      notifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.lastPopulation = 0
    this.lastDay = -1
    this.batteryNotificationShown = false
    this.lastCredits = 15000000
    this.calculatePowerRequired()
  }

  setGameSpeed(speed: number): void {
    // Clamp speed between 0.25x and 4x
    this.state.gameSpeed = Math.max(0.25, Math.min(4, speed))
    this.state.updatedAt = new Date()
  }

  getState(): GameState {
    return this.state
  }

  private addNotification(message: string, type: 'info' | 'warning' | 'success'): void {
    const notification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
    }
    this.state.notifications.push(notification)
    // Keep only last 10 notifications
    if (this.state.notifications.length > 10) {
      this.state.notifications.shift()
    }
  }

  getEnergyUnitTypes(): EnergyUnitType[] {
    return Object.values(ENERGY_UNIT_TYPES)
  }

  buyEnergyUnit(typeId: string): boolean {
    const unitType = ENERGY_UNIT_TYPES[typeId]
    if (!unitType) return false

    // Battery can only be purchased from Day 10 onwards
    if (unitType.isBattery && this.state.currentDay < 10) return false

    if (this.state.credits < unitType.cost) return false

    const newUnit: EnergyUnit = {
      id: `${typeId}-${Date.now()}`,
      typeId,
      isRunning: false,
      powerOutput: 0,
      hoursRunning: 0,
      hoursStoppedFor: 0,
      chargePercent: unitType.isBattery ? 100 : undefined, // batteries start at 100% charge
      totalCost: unitType.cost,
    }

    this.state.credits -= unitType.cost
    this.state.energyUnits.push(newUnit)
    this.state.updatedAt = new Date()
    return true
  }

  toggleUnit(unitId: string): boolean {
    const unit = this.state.energyUnits.find((u) => u.id === unitId)
    if (!unit) return false

    const unitType = ENERGY_UNIT_TYPES[unit.typeId]

    if (!unit.isRunning) {
      // Turning on
      if (this.state.credits < unitType.startupCost) return false
      this.state.credits -= unitType.startupCost
      unit.isRunning = true
      unit.startTime = this.state.currentHour
      unit.hoursRunning = 0
      unit.powerOutput = 0
    } else {
      // Turning off - start ramp-down for coal and nuclear
      unit.isRunning = false
      unit.hoursStoppedFor = 0 // start tracking ramp-down time
      // Don't immediately zero out power - let it ramp down gradually
    }

    this.state.updatedAt = new Date()
    return true
  }

  private calculatePowerRequired(): void {
    // Population increases by 1000 every 5 days
    const basePopulation = 10000
    const populationIncrease = Math.floor(this.state.currentDay / 5) * 1000
    const population = basePopulation + populationIncrease
    const hour = this.state.currentHour
    let avgPowerPerPerson: number

    // Power demand varies by hour
    if (hour >= 6 && hour < 9) {
      // Morning ramp up (6am-9am)
      avgPowerPerPerson = 5 + ((hour - 6) / 3) * 3 // 5-8 kW
    } else if (hour >= 9 && hour < 18) {
      // Daytime peak (9am-6pm)
      avgPowerPerPerson = 8
    } else if (hour >= 18 && hour < 22) {
      // Evening ramp down (6pm-10pm)
      avgPowerPerPerson = 8 - ((hour - 18) / 4) * 5 // 8-3 kW
    } else {
      // Night low (10pm-6am)
      avgPowerPerPerson = 3
    }

    this.state.powerRequired = (population * avgPowerPerPerson) / 1000 // Convert to MWh
  }

  private calculatePowerGenerated(): void {
    this.state.powerGenerated = 0
    let totalCarbon = 0

    this.state.energyUnits.forEach((unit) => {
      const unitType = ENERGY_UNIT_TYPES[unit.typeId]

      // Handle units that are running
      if (unit.isRunning) {
        // Check if unit is available (Solar only during day)
        if (unitType.availableHours) {
          const [start, end] = unitType.availableHours
          if (this.state.currentHour < start || this.state.currentHour >= end) {
            return
          }
        }

        // Calculate power output based on ramp-up time
        let powerOutput = unitType.minMw
        if (unit.hoursRunning < unitType.timeToFullPower) {
          // Still ramping up
          const ramupPercent = unit.hoursRunning / unitType.timeToFullPower
          powerOutput = unitType.minMw + (unitType.maxMw - unitType.minMw) * ramupPercent
        } else {
          // At full power
          powerOutput = unitType.maxMw
        }

        // Add randomness for unpredictable units (wind, solar cloud coverage)
        if (unitType.unpredictable) {
          powerOutput *= 0.5 + Math.random() // 50-150% of max
        }

        // Solar panels have variable output due to cloud coverage even during day
        if (unitType.id === 'solar') {
          powerOutput *= 0.6 + Math.random() * 0.4 // 60-100% of max due to clouds
        }

        // Battery depletion: reduce charge by percentage based on output
        if (unitType.isBattery && unit.chargePercent !== undefined && unit.chargePercent > 0) {
          // Battery: 2MW for 4 hours = 8 MWh full charge. At max 2MW output, charge -= 25% per hour
          // Actual depletion scales with power output
          const depletionRate = (powerOutput / unitType.maxMw) * 25 // 25% per hour at max output
          unit.chargePercent = Math.max(0, unit.chargePercent - depletionRate)
        }

        unit.powerOutput = powerOutput
        this.state.powerGenerated += powerOutput
        totalCarbon += unitType.carbonDioxidePerHour * (powerOutput / (unitType.maxMw || 1))
      } else {
        // Handle units that are ramping down (coal and nuclear only)
        if ((unitType.id === 'coal' || unitType.id === 'nuclear') && unit.hoursStoppedFor < unitType.timeToFullPower) {
          // Ramp down gradually
          const rampDownPercent = unit.hoursStoppedFor / unitType.timeToFullPower
          const powerOutput = unitType.maxMw * (1 - rampDownPercent)
          unit.powerOutput = powerOutput
          this.state.powerGenerated += powerOutput
          totalCarbon += unitType.carbonDioxidePerHour * (powerOutput / unitType.maxMw)
        } else {
          // Fully ramped down
          unit.powerOutput = 0
        }
      }
    })

    this.state.carbonDioxideTotal += totalCarbon
  }

  private applyRunningCosts(): void {
    this.state.energyUnits.forEach((unit) => {
      if (!unit.isRunning) return

      const unitType = ENERGY_UNIT_TYPES[unit.typeId]

      // Check availability again
      if (unitType.availableHours) {
        const [start, end] = unitType.availableHours
        if (this.state.currentHour < start || this.state.currentHour >= end) {
          return
        }
      }

      // Only apply running costs once the unit has started (i.e., passed its startup/ramp-up period)
      const hasStarted = unit.hoursRunning >= unitType.timeToFullPower
      if (hasStarted) {
        const cost = unitType.runningCostPerHour
        this.state.credits -= cost
      }
    })
  }

  update(): void {
    if (!this.state.gameActive) return

    // Increment hour by game speed multiplier
    this.state.currentHour += this.state.gameSpeed

    if (this.state.currentHour >= 24) {
      this.state.currentHour -= 24
      this.state.currentDay += 1

      if (this.state.currentDay >= 30) {
        this.state.gameActive = false
        return
      }
    }

    // Update hour-based values
    this.calculatePowerRequired()
    this.calculatePowerGenerated()
    this.applyRunningCosts()

    // Update unit running hours and ramp-down tracking
    this.state.energyUnits.forEach((unit) => {
      if (unit.isRunning) {
        unit.hoursRunning += 1
      } else if ((ENERGY_UNIT_TYPES[unit.typeId].id === 'coal' || ENERGY_UNIT_TYPES[unit.typeId].id === 'nuclear') && 
                 unit.hoursStoppedFor < ENERGY_UNIT_TYPES[unit.typeId].timeToFullPower) {
        // Increment ramp-down time for coal and nuclear plants
        unit.hoursStoppedFor += 1
      }
    })

    // Battery charging: distribute excess power across all stopped batteries
    // Each battery needs 1MW of excess power to charge at 10% per hour
    const excessPower = Math.max(0, this.state.powerGenerated - this.state.powerRequired)
    
    // Find all stopped batteries that can be charged
    const batteriesToCharge = this.state.energyUnits.filter((unit) => {
      const unitType = ENERGY_UNIT_TYPES[unit.typeId]
      return unitType.isBattery && !unit.isRunning && unit.chargePercent !== undefined && unit.chargePercent < 100
    })
    
    if (batteriesToCharge.length > 0 && excessPower >= batteriesToCharge.length) {
      // Distribute excess power evenly across all batteries that need charging
      const powerPerBattery = excessPower / batteriesToCharge.length
      // Charge rate: 10% per hour per MW of excess power allocated
      const chargeRatePerMw = 10
      
      batteriesToCharge.forEach((unit) => {
        const chargeIncrease = (powerPerBattery / 1) * chargeRatePerMw // 1MW base for 10% per hour
        unit.chargePercent = Math.min(100, unit.chargePercent! + chargeIncrease)
      })
    }

    // Check for power deficit (penalty only applies from Day 5 onwards)
    if (this.state.powerGenerated < this.state.powerRequired && this.state.currentDay >= 5) {
      // Power shortage penalty: 10,000 credits per MW shortage
      const shortage = this.state.powerRequired - this.state.powerGenerated
      this.state.credits -= shortage * 10000
    }

    // Add population-based income from Day 5 onwards if power demand is met
    if (this.state.currentDay >= 5 && this.state.powerGenerated >= this.state.powerRequired) {
      // Calculate population based on current day
      const basePopulation = 10000
      const populationIncrease = Math.floor(this.state.currentDay / 5) * 1000
      const population = basePopulation + populationIncrease
      // Grant 0.5 × population credits per hour
      this.state.credits += population * 0.5
    }

    // Notification tracking
    const currentPopulation = 10000 + Math.floor(this.state.currentDay / 5) * 1000
    
    // Check for population increase
    if (currentPopulation > this.lastPopulation) {
      this.addNotification(`Population increased to ${currentPopulation}`, 'success')
      this.lastPopulation = currentPopulation
    }
    
    // Check for battery availability (Day 10)
    if (this.state.currentDay === 10 && !this.batteryNotificationShown) {
      this.addNotification('Batteries are now available!', 'info')
      this.batteryNotificationShown = true
    }
    
    // Check for power deficit fines
    if (this.state.powerGenerated < this.state.powerRequired && this.state.currentDay >= 5) {
      const shortage = this.state.powerRequired - this.state.powerGenerated
      const fine = shortage * 10000
      if (this.state.credits < this.lastCredits) {
        this.addNotification(`Fine deducted: -₹${fine.toLocaleString()} (power deficit)`, 'warning')
      }
    }
    
    // Check for population income
    if (this.state.currentDay >= 5 && this.state.powerGenerated >= this.state.powerRequired) {
      const basePopulation = 10000
      const populationIncrease = Math.floor(this.state.currentDay / 5) * 1000
      const population = basePopulation + populationIncrease
      const income = population * 0.5
      if (this.state.credits > this.lastCredits) {
        this.addNotification(`Income added: +₹${income.toLocaleString()} (population)`, 'success')
      }
    }
    
    this.lastCredits = this.state.credits

    this.state.updatedAt = new Date()
  }
}
