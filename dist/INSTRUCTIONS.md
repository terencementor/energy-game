# Energy Game - Standalone Game

## How to Run

**Double-click `RUN_GAME.bat`** in the game folder to start playing!

The game will automatically:
1. Check for Node.js (required - free to install)
2. Start the game server
3. Open the game in your browser

### Requirements
- **Windows 10 or later** (64-bit)
- **Node.js 16+** (free download from https://nodejs.org/)

### Installation

1. Download the Energy Game folder
2. Ensure Node.js is installed on your system
3. Double-click **`RUN_GAME.bat`**
4. Game opens in your browser at `http://localhost:3000`

### What You'll See

- A console window showing the server running (this is normal)
- Your browser opens with the Energy Game interface
- If browser doesn't open, manually visit `http://localhost:3000`

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

**Game won't start:**
- Ensure Node.js 16+ is installed
- Run from the game folder
- Check that port 3000 is not in use

**Browser won't open:**
- Manually navigate to `http://localhost:3000`
- Wait 5 seconds after clicking RUN_GAME.bat

**Server won't start:**
- Make sure you have read/write permissions in the game folder
- Check that you're running from the correct directory

**Closing the game:**
- Close the console window OR
- Press Ctrl+C in the console

## Version
Energy Game v1.0.0

Enjoy your economic simulation!

