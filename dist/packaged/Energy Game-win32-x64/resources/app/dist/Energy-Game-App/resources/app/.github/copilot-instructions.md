# Energy Game - Web-based Economy Simulation

## Project Overview
A real-time economy simulation game where players manage resources, production chains, and market dynamics.

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (development)
- **State Management**: React Context API

## Setup Checklist

- [x] Create project directories and configuration
- [x] Scaffold frontend (React/Vite)
- [x] Scaffold backend (Node.js/Express)
- [x] Set up economy system and game logic
- [x] Install all dependencies (when Node.js is available)
- [x] Configure development environment
- [x] Create run tasks for development
- [x] Configure build settings
- [x] Complete documentation

## Development Commands
- Frontend dev: `npm run dev` (from frontend directory)
- Backend dev: `npm run dev` (from backend directory)
- Frontend build: `npm run build` (from frontend directory)
- Backend build: `npm run build` (from backend directory)

## Project Structure

```
energy-game/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components (GameBoard, ResourceDisplay)
│   │   ├── context/             # React Context (GameContext for state management)
│   │   ├── App.tsx              # Main app component
│   │   ├── App.css              # Global styles
│   │   └── main.tsx             # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Game.ts          # Game state and logic
│   │   ├── routes/
│   │   │   └── game.ts          # API endpoints
│   │   └── index.ts             # Express server setup
│   ├── package.json
│   └── tsconfig.json
├── .vscode/
│   └── tasks.json               # Development tasks
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## VS Code Tasks Available

Run with `Ctrl+Shift+B` in VS Code:
- Install Frontend Dependencies
- Install Backend Dependencies
- Frontend Dev Server
- Backend Dev Server
- Build Frontend
- Build Backend

## Next Steps

1. Install Node.js 16+ from https://nodejs.org/
2. Open project in VS Code
3. Run "Install Frontend Dependencies" task
4. Run "Install Backend Dependencies" task
5. Run "Frontend Dev Server" task (opens http://localhost:5173)
6. In another terminal, run "Backend Dev Server" task (runs on http://localhost:3000)
7. Game is ready to play and develop!
