// Energy unit types definition
const ENERGY_UNIT_TYPES = {
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
    isBattery: true,
  },
}

class Game {
  constructor(id = 'default') {
    this.state = {
      id,
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

  startGame() {
    this.state.gameActive = true
    this.state.updatedAt = new Date()
  }

  restartGame() {
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

  setGameSpeed(speed) {
    this.state.gameSpeed = Math.max(0.25, Math.min(4, speed))
    this.state.updatedAt = new Date()
  }

  getState() {
    return this.state
  }

  addNotification(message, type) {
    const notification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
    }
    this.state.notifications.push(notification)
    if (this.state.notifications.length > 10) {
      this.state.notifications.shift()
    }
  }

  getEnergyUnitTypes() {
    return Object.values(ENERGY_UNIT_TYPES)
  }

  buyEnergyUnit(typeId) {
    const unitType = ENERGY_UNIT_TYPES[typeId]
    if (!unitType) return false

    if (unitType.isBattery && this.state.currentDay < 10) return false

    if (this.state.credits < unitType.cost) return false

    const newUnit = {
      id: `${typeId}-${Date.now()}`,
      typeId,
      isRunning: false,
      powerOutput: 0,
      hoursRunning: 0,
      hoursStoppedFor: 0,
      chargePercent: unitType.isBattery ? 100 : undefined,
      totalCost: unitType.cost,
    }

    this.state.credits -= unitType.cost
    this.state.energyUnits.push(newUnit)
    this.state.updatedAt = new Date()
    return true
  }

  toggleUnit(unitId) {
    const unit = this.state.energyUnits.find((u) => u.id === unitId)
    if (!unit) return false

    const unitType = ENERGY_UNIT_TYPES[unit.typeId]

    if (!unit.isRunning) {
      if (this.state.credits < unitType.startupCost) return false
      this.state.credits -= unitType.startupCost
      unit.isRunning = true
      unit.startTime = this.state.currentHour
      unit.hoursRunning = 0
      unit.powerOutput = 0
    } else {
      unit.isRunning = false
      unit.hoursStoppedFor = 0
    }

    this.state.updatedAt = new Date()
    return true
  }

  calculatePowerRequired() {
    const basePopulation = 10000
    const populationIncrease = Math.floor(this.state.currentDay / 5) * 1000
    const population = basePopulation + populationIncrease
    const hour = this.state.currentHour
    let avgPowerPerPerson

    if (hour >= 6 && hour < 9) {
      avgPowerPerPerson = 5 + ((hour - 6) / 3) * 3
    } else if (hour >= 9 && hour < 18) {
      avgPowerPerPerson = 8
    } else if (hour >= 18 && hour < 22) {
      avgPowerPerPerson = 8 - ((hour - 18) / 4) * 5
    } else {
      avgPowerPerPerson = 3
    }

    this.state.powerRequired = (population * avgPowerPerPerson) / 1000
  }

  calculatePowerGenerated() {
    this.state.powerGenerated = 0
    let totalCarbon = 0

    this.state.energyUnits.forEach((unit) => {
      const unitType = ENERGY_UNIT_TYPES[unit.typeId]

      if (unit.isRunning) {
        if (unitType.availableHours) {
          const [start, end] = unitType.availableHours
          if (this.state.currentHour < start || this.state.currentHour >= end) {
            return
          }
        }

        let powerOutput = unitType.minMw
        if (unit.hoursRunning < unitType.timeToFullPower) {
          const ramupPercent = unit.hoursRunning / unitType.timeToFullPower
          powerOutput = unitType.minMw + (unitType.maxMw - unitType.minMw) * ramupPercent
        } else {
          powerOutput = unitType.maxMw
        }

        if (unitType.unpredictable) {
          powerOutput *= 0.5 + Math.random()
        }

        if (unitType.id === 'solar') {
          powerOutput *= 0.6 + Math.random() * 0.4
        }

        if (unitType.isBattery && unit.chargePercent !== undefined && unit.chargePercent > 0) {
          const depletionRate = (powerOutput / unitType.maxMw) * 25
          unit.chargePercent = Math.max(0, unit.chargePercent - depletionRate)
        }

        unit.powerOutput = powerOutput
        this.state.powerGenerated += powerOutput
        totalCarbon += unitType.carbonDioxidePerHour * (powerOutput / (unitType.maxMw || 1))
      } else {
        if ((unitType.id === 'coal' || unitType.id === 'nuclear') && unit.hoursStoppedFor < unitType.timeToFullPower) {
          const rampDownPercent = unit.hoursStoppedFor / unitType.timeToFullPower
          const powerOutput = unitType.maxMw * (1 - rampDownPercent)
          unit.powerOutput = powerOutput
          this.state.powerGenerated += powerOutput
          totalCarbon += unitType.carbonDioxidePerHour * (powerOutput / unitType.maxMw)
        } else {
          unit.powerOutput = 0
        }
      }
    })

    this.state.carbonDioxideTotal += totalCarbon
  }

  applyRunningCosts() {
    this.state.energyUnits.forEach((unit) => {
      if (!unit.isRunning) return

      const unitType = ENERGY_UNIT_TYPES[unit.typeId]

      if (unitType.availableHours) {
        const [start, end] = unitType.availableHours
        if (this.state.currentHour < start || this.state.currentHour >= end) {
          return
        }
      }

      const hasStarted = unit.hoursRunning >= unitType.timeToFullPower
      if (hasStarted) {
        const cost = unitType.runningCostPerHour
        this.state.credits -= cost
      }
    })
  }

  update() {
    if (!this.state.gameActive) return

    this.state.currentHour += this.state.gameSpeed

    if (this.state.currentHour >= 24) {
      this.state.currentHour -= 24
      this.state.currentDay += 1

      if (this.state.currentDay >= 30) {
        this.state.gameActive = false
        return
      }
    }

    this.calculatePowerRequired()
    this.calculatePowerGenerated()
    this.applyRunningCosts()

    this.state.energyUnits.forEach((unit) => {
      if (unit.isRunning) {
        unit.hoursRunning += 1
      } else if ((ENERGY_UNIT_TYPES[unit.typeId].id === 'coal' || ENERGY_UNIT_TYPES[unit.typeId].id === 'nuclear') && 
                 unit.hoursStoppedFor < ENERGY_UNIT_TYPES[unit.typeId].timeToFullPower) {
        unit.hoursStoppedFor += 1
      }
    })

    const excessPower = Math.max(0, this.state.powerGenerated - this.state.powerRequired)
    
    const batteriesToCharge = this.state.energyUnits.filter((unit) => {
      const unitType = ENERGY_UNIT_TYPES[unit.typeId]
      return unitType.isBattery && !unit.isRunning && unit.chargePercent !== undefined && unit.chargePercent < 100
    })
    
    if (batteriesToCharge.length > 0 && excessPower >= batteriesToCharge.length) {
      const powerPerBattery = excessPower / batteriesToCharge.length
      const chargeRatePerMw = 10
      
      batteriesToCharge.forEach((unit) => {
        const chargeIncrease = (powerPerBattery / 1) * chargeRatePerMw
        unit.chargePercent = Math.min(100, unit.chargePercent + chargeIncrease)
      })
    }

    if (this.state.powerGenerated < this.state.powerRequired && this.state.currentDay >= 5) {
      const shortage = this.state.powerRequired - this.state.powerGenerated
      this.state.credits -= shortage * 10000
    }

    if (this.state.currentDay >= 5 && this.state.powerGenerated >= this.state.powerRequired) {
      const basePopulation = 10000
      const populationIncrease = Math.floor(this.state.currentDay / 5) * 1000
      const population = basePopulation + populationIncrease
      this.state.credits += population * 0.5
    }

    const currentPopulation = 10000 + Math.floor(this.state.currentDay / 5) * 1000
    
    if (currentPopulation > this.lastPopulation) {
      this.addNotification(`Population increased to ${currentPopulation}`, 'success')
      this.lastPopulation = currentPopulation
    }
    
    if (this.state.currentDay === 10 && !this.batteryNotificationShown) {
      this.addNotification('Batteries are now available!', 'info')
      this.batteryNotificationShown = true
    }
    
    if (this.state.powerGenerated < this.state.powerRequired && this.state.currentDay >= 5) {
      const shortage = this.state.powerRequired - this.state.powerGenerated
      const fine = shortage * 10000
      if (this.state.credits < this.lastCredits) {
        this.addNotification(`Fine deducted: -₹${fine.toLocaleString()} (power deficit)`, 'warning')
      }
    }
    
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

export default Game
