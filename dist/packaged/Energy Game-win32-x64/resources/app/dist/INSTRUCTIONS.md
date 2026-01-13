# Energy Game - Standalone App

## How to Run

### Option 1: Direct Execution (Recommended)
Navigate to the `Energy-Game-App` folder and double-click:
```
Energy Game.exe
```

The game will launch immediately. No installation required.

### Installation Notes
- No Node.js installation needed
- No npm or dependencies to install
- Fully standalone executable
- Works on Windows 10/11 (x64)

## Game Overview
- **Duration**: 30-day energy management simulation
- **Goal**: Balance power production, costs, and environmental impact
- **Starting Capital**: 15 million credits

## Key Features
- 7 energy unit types: Engine, Turbine, Solar, Wind, Coal, Nuclear, Battery
- Real-time economy with supply/demand penalties
- Population growth and income mechanics
- Battery storage (unlocked Day 10)
- Day/night cycles affecting solar power
- Speed controls (0.5x, 1x, 2x, 4x)
- Notification system for major events

## Game Mechanics

### Power Units
- **Engine**: Fast, expensive, high pollution
- **Turbine**: Reliable baseline power
- **Solar**: Free when available (8am-6pm), weather variable
- **Wind**: Renewable, consistent
- **Coal**: Cheap but polluting, ramps down over time
- **Nuclear**: Efficient but fixed output
- **Battery**: Stores excess power (Day 10+)

### Economy
- Day 5+: Penalties for power deficits (10,000 credits/MW)
- Day 5+: Population-based income (0.5 × population credits/hour if demand met)
- Population grows naturally every 5 days

### Notifications
Watch for important events in the top-right panel:
- Population increases
- Battery availability
- Power deficit fines
- Income earned

## Keyboard Controls
- Adjust speed with buttons in top-left
- Market automatically updates with available units
- Click units to purchase

## Troubleshooting
- **App won't start**: Ensure Windows 10+ with administrator privileges
- **Game freezes**: Check available disk space and RAM
- **Backend connection error**: Wait 2-3 seconds, then refresh the window

## Version
Energy Game v1.0.0

Enjoy your economic simulation!
