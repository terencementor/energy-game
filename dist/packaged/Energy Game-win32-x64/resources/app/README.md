# Energy Game - Web-based Economy Simulation

A real-time economy simulation game built with React and Node.js where players manage resources, production chains, and market dynamics.

## Project Structure

```
energy-game/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
└── .github/
    └── copilot-instructions.md
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (development)
- **State Management**: React Context API

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Development

In two separate terminals:

```bash
# Terminal 1: Start frontend dev server
cd frontend
npm run dev
# Runs on http://localhost:5173
```

```bash
# Terminal 2: Start backend server
cd backend
npm run dev
# Runs on http://localhost:3000
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## Features

- **Real-time Resource Management**: Monitor and manage energy, coal, and water resources
- **Production & Consumption**: Resources are produced and consumed in real-time
- **Economy System**: Generate income based on resource production
- **Game State Tracking**: Track game progression with tick-based updates

## API Endpoints

### Game Routes (`/api/game`)

- `GET /state` - Get current game state
- `POST /update` - Update game tick
- `POST /resource/:resourceId/production` - Update resource production rate

## Game Mechanics

Resources have:
- **Amount**: Current quantity
- **Production Rate**: Units produced per tick
- **Consumption Rate**: Units consumed per tick

The game runs on a tick system where resources are updated continuously, and players earn money based on total production.

## Development Notes

- Frontend is configured to proxy API requests to the backend
- The backend uses in-memory game state (would migrate to database for production)
- TypeScript strict mode enabled for type safety
- ESM modules used throughout

## Future Enhancements

- [ ] Database integration (SQLite/PostgreSQL)
- [ ] Multiplayer support
- [ ] Advanced trading system
- [ ] Building/infrastructure upgrades
- [ ] Leaderboards
- [ ] Persistent game saves
- [ ] Advanced economy simulation algorithms
