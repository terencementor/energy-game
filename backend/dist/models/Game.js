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
        availableHours: [8, 17],
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
};
export class Game {
    constructor(id = 'default') {
        this.state = {
            id,
            budget: 15000000,
            credits: 15000000,
            currentHour: 6, // start at 6 AM
            currentDay: 0,
            gameActive: false,
            energyUnits: [],
            powerRequired: 0,
            powerGenerated: 0,
            carbonDioxideTotal: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.calculatePowerRequired();
    }
    startGame() {
        this.state.gameActive = true;
        this.state.updatedAt = new Date();
    }
    getState() {
        return this.state;
    }
    getEnergyUnitTypes() {
        return Object.values(ENERGY_UNIT_TYPES);
    }
    buyEnergyUnit(typeId) {
        const unitType = ENERGY_UNIT_TYPES[typeId];
        if (!unitType)
            return false;
        if (this.state.credits < unitType.cost)
            return false;
        const newUnit = {
            id: `${typeId}-${Date.now()}`,
            typeId,
            isRunning: false,
            powerOutput: 0,
            hoursRunning: 0,
            totalCost: unitType.cost,
        };
        this.state.credits -= unitType.cost;
        this.state.energyUnits.push(newUnit);
        this.state.updatedAt = new Date();
        return true;
    }
    toggleUnit(unitId) {
        const unit = this.state.energyUnits.find((u) => u.id === unitId);
        if (!unit)
            return false;
        const unitType = ENERGY_UNIT_TYPES[unit.typeId];
        if (!unit.isRunning) {
            // Turning on
            if (this.state.credits < unitType.startupCost)
                return false;
            this.state.credits -= unitType.startupCost;
            unit.isRunning = true;
            unit.startTime = this.state.currentHour;
            unit.hoursRunning = 0;
            unit.powerOutput = 0;
        }
        else {
            // Turning off
            unit.isRunning = false;
            unit.powerOutput = 0;
            unit.hoursRunning = 0;
        }
        this.state.updatedAt = new Date();
        return true;
    }
    calculatePowerRequired() {
        const population = 10000;
        const hour = this.state.currentHour;
        let avgPowerPerPerson;
        // Power demand varies by hour
        if (hour >= 6 && hour < 9) {
            // Morning ramp up (6am-9am)
            avgPowerPerPerson = 5 + ((hour - 6) / 3) * 3; // 5-8 kW
        }
        else if (hour >= 9 && hour < 18) {
            // Daytime peak (9am-6pm)
            avgPowerPerPerson = 8;
        }
        else if (hour >= 18 && hour < 22) {
            // Evening ramp down (6pm-10pm)
            avgPowerPerPerson = 8 - ((hour - 18) / 4) * 5; // 8-3 kW
        }
        else {
            // Night low (10pm-6am)
            avgPowerPerPerson = 3;
        }
        this.state.powerRequired = (population * avgPowerPerPerson) / 1000; // Convert to MWh
    }
    calculatePowerGenerated() {
        this.state.powerGenerated = 0;
        let totalCarbon = 0;
        this.state.energyUnits.forEach((unit) => {
            if (!unit.isRunning)
                return;
            const unitType = ENERGY_UNIT_TYPES[unit.typeId];
            // Check if unit is available (Solar only during day)
            if (unitType.availableHours) {
                const [start, end] = unitType.availableHours;
                if (this.state.currentHour < start || this.state.currentHour >= end) {
                    return;
                }
            }
            // Calculate power output based on ramp-up time
            let powerOutput = unitType.minMw;
            if (unit.hoursRunning < unitType.timeToFullPower) {
                // Still ramping up
                const ramupPercent = unit.hoursRunning / unitType.timeToFullPower;
                powerOutput = unitType.minMw + (unitType.maxMw - unitType.minMw) * ramupPercent;
            }
            else {
                // At full power
                powerOutput = unitType.maxMw;
            }
            // Add randomness for unpredictable units
            if (unitType.unpredictable) {
                powerOutput *= 0.5 + Math.random(); // 50-150% of max
            }
            unit.powerOutput = powerOutput;
            this.state.powerGenerated += powerOutput;
            totalCarbon += unitType.carbonDioxidePerHour * (powerOutput / (unitType.maxMw || 1));
        });
        this.state.carbonDioxideTotal += totalCarbon;
    }
    applyRunningCosts() {
        this.state.energyUnits.forEach((unit) => {
            if (!unit.isRunning)
                return;
            const unitType = ENERGY_UNIT_TYPES[unit.typeId];
            // Check availability again
            if (unitType.availableHours) {
                const [start, end] = unitType.availableHours;
                if (this.state.currentHour < start || this.state.currentHour >= end) {
                    return;
                }
            }
            // Only apply running costs once the unit has started (i.e., passed its startup/ramp-up period)
            const hasStarted = unit.hoursRunning >= unitType.timeToFullPower;
            if (hasStarted) {
                const cost = unitType.runningCostPerHour;
                this.state.credits -= cost;
            }
        });
    }
    update() {
        if (!this.state.gameActive)
            return;
        // Increment hour
        this.state.currentHour += 1;
        if (this.state.currentHour >= 24) {
            this.state.currentHour = 0;
            this.state.currentDay += 1;
            if (this.state.currentDay >= 30) {
                this.state.gameActive = false;
                return;
            }
        }
        // Update hour-based values
        this.calculatePowerRequired();
        this.calculatePowerGenerated();
        this.applyRunningCosts();
        // Update unit running hours
        this.state.energyUnits.forEach((unit) => {
            if (unit.isRunning) {
                unit.hoursRunning += 1;
            }
        });
        // Check for power deficit
        if (this.state.powerGenerated < this.state.powerRequired) {
            // Power shortage penalty
            const shortage = this.state.powerRequired - this.state.powerGenerated;
            this.state.credits -= shortage * 1000; // 1000 credits per MWh shortage
        }
        this.state.updatedAt = new Date();
    }
}
