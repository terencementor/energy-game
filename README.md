# Energy Game - 30-Day Energy Management Simulator

A real-time 30-day energy management simulation where you balance power production, costs, population growth, and environmental impact. Built with React and Node.js.

## 🚀 READY TO DEPLOY? START HERE!

**Your game is fully built and ready for the cloud in 5 minutes!**

👉 **See [START_HERE.md](START_HERE.md)** for next steps

Or jump straight to [DEPLOY_COMMANDS.md](DEPLOY_COMMANDS.md) for copy-paste ready commands.

## 🎮 Play Online Now

**No installation needed!**

Deploy to Vercel in 5 minutes → Get a shareable URL → Share with your team

See [Deployment Guide](#-deploy-to-cloud) below

## Game Overview

Manage 7 different energy sources (Engine, Turbine, Solar, Wind, Coal, Nuclear, Battery) to meet power demand across a 30-day cycle. Balance cost, reliability, and environmental impact.

### Key Features

- 🏭 **7 Energy Unit Types** with different costs, outputs, and ramp speeds
- 💰 **Real Economy**: Power deficits cost money, meeting demand earns income
- 📈 **Population Growth**: Affects demand and income every 5 days
- 🔋 **Battery Storage**: Unlocks Day 10, stores excess power for emergencies
- 🌓 **Day/Night Cycles**: Solar output varies by time of day
- ⚡ **Speed Controls**: Play at 0.5x, 1x, 2x, or 4x speed
- 📊 **Notifications**: Track important economic and technical events
- 🎯 **30-Day Campaign**: Complete challenges across a full month cycle

## 🚀 Deploy to Cloud (Free - 5 Minutes)

### Option A: GitHub + Vercel (Recommended)

1. **Create GitHub account** (free at https://github.com)

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/energy-game.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com (free account)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Get instant live URL!

4. **Share with Team**
   - Copy the URL Vercel gives you
   - Send it to team members
   - They click and play immediately

### Option B: Vercel CLI (Fastest)

```bash
npm install -g vercel
vercel
```

## 💻 Run Locally

### Prerequisites
- Node.js 16+ (https://nodejs.org/)

### Setup

```bash
# Install all dependencies
npm install
npm --prefix backend install
npm --prefix frontend install

# Build for production
npm run build-vercel

# Start server
npm start
```

Runs at: http://localhost:3000

### Development Mode

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Frontend runs at http://localhost:5173, Backend at http://localhost:3000

```bash
# Terminal 2: Start backend server
cd backend
npm run dev
# Runs on http://localhost:3000
```

### Building for Production

```bash
npm run build-vercel
```

## 📊 Game Mechanics

### Energy Units

| Unit | Cost/MW | Output | Ramp Speed | Notes |
|------|---------|--------|-----------|-------|
| **Engine** | Very High | Fast | Instant | Most expensive, fastest response |
| **Turbine** | Medium | Medium | Instant | Reliable baseline power |
| **Solar** | Free | Variable | Instant | Only works 8am-6pm, weather dependent |
| **Wind** | Low | Medium | Instant | Renewable, variable |
| **Coal** | Low | High | Slow | High pollution, ramps down over time |
| **Nuclear** | Medium | High | Slow | Efficient, constant output |
| **Battery** | High | Variable | Instant | Storage only (unlocks Day 10) |

### Economy System

- **Starting Budget**: 15,000,000 credits
- **Power Deficit Penalty** (Day 5+): 10,000 credits per MW short
- **Income** (Day 5+): 0.5 × population credits/hour (when demand is met)
- **Population Growth**: +10% every 5 days (increases demand)
- **Battery Unlock**: Day 10 (allows storing excess power)

### Battery Storage

- **Charge Rate**: 10%/hour (when producing 1+ MW excess)
- **Discharge Rate**: Scales with demand (up to 25%/hour at max)
- **Purpose**: Emergency power during deficits
- **Unlock Condition**: Day 10

### Game Cycle

- **Game Speed**: 1 hour = 5 seconds (configurable with speed controls)
- **Game Duration**: 30 days
- **Day/Night**: 24-hour cycle with solar output varying 8am-6pm
- **Time Compression**: Can play full game in ~25 minutes

## 📁 Project Structure

```
energy-game/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # UI components (GameBoard, etc)
│   │   ├── context/            # GameContext state management
│   │   ├── App.tsx             # Main app
│   │   └── main.tsx            # Entry point
│   ├── dist/                   # Production build (created by npm run build)
│   └── package.json
├── backend/                     # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── models/
│   │   │   └── Game.ts         # Core game engine & logic
│   │   ├── routes/
│   │   │   └── game.ts         # API endpoints (/api/game/*)
│   │   └── index.ts            # Express server & static file serving
│   ├── dist/                   # Compiled JavaScript
│   │   └── public/             # Frontend build (copied during deploy)
│   └── package.json
├── package.json                # Root scripts
├── vercel.json                 # Vercel deployment config
├── RUN_GAME.bat               # Windows launcher (for local testing)
├── DEPLOY_TO_VERCEL.md        # Detailed deployment guide
└── README.md                   # This file
```

## 📋 NPM Scripts

| Script | Purpose |
|--------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Run entire app in dev mode (both frontend & backend) |
| `npm run build-frontend` | Build frontend for production (Vite) |
| `npm run build-backend` | Compile TypeScript backend to JavaScript |
| `npm run build-vercel` | Complete production build (frontend + backend) |
| `npm start` | Run production server (after building) |
| `npm run copy-frontend` | Copy built frontend to backend public folder |

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, CSS3
- **Backend**: Node.js, Express 4, TypeScript
- **Database**: SQLite3 (development only)
- **State Management**: React Context API
- **Deployment**: Vercel (serverless)
- **Hosting**: GitHub (code repository)

## 📚 Additional Resources

- [Vercel Deployment Guide](DEPLOY_TO_VERCEL.md) - Detailed step-by-step
- [Backend Development](backend/README.md) - Server & API docs
- [Frontend Development](frontend/README.md) - UI & components docs

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
# Windows - kill node process
taskkill /F /IM node.exe
```

### "Cannot find module"
```bash
# Reinstall all dependencies
npm install
npm --prefix backend install
npm --prefix frontend install
```

### Game shows blank page
- Wait 5 seconds for initial load
- Check browser console (F12) for errors
- Verify `npm run build-vercel` completes successfully
- Try `npm start` and navigate to http://localhost:3000

### Deployment fails on Vercel
- Check build logs on Vercel dashboard
- Verify `npm run build-vercel` succeeds locally
- Make sure `.gitignore` doesn't exclude needed files
- Ensure `backend/src/index.ts` properly serves frontend from `public/`

## 🎮 Gameplay Tips

1. **Early Game (Days 1-4)**
   - Build Turbine units for reliable baseline
   - Use Solar during day hours
   - Don't overspend - penalties start Day 5

2. **Mid Game (Days 5-9)**
   - Monitor power deficit penalties
   - Watch population growth every 5 days
   - Start planning for battery unlock

3. **Late Game (Days 10-30)**
   - Unlock and use Battery storage
   - Phase out Coal (ramps down)
   - Maximize renewable energy
   - Manage population income efficiently

## 📝 Game Calculations

**Population Income per Hour:**
```
Income = 0.5 × current_population (in millions)
```

**Power Deficit Cost per Hour:**
```
Penalty = 10,000 credits × MW_short
```

**Battery Charge Efficiency:**
```
Charge_rate = 10% per hour (requires 1+ MW excess)
Discharge_rate = scales with demand
```

## 🤝 Contributing

Have ideas for improvements?
- Suggest new energy types
- Balance adjustments
- UI enhancements
- New game modes

## 📄 License

This project is provided as-is for educational and entertainment purposes.

## 🚀 Let's Go!

Ready to deploy?

```bash
# Option 1: Deploy to Vercel (Recommended)
# Follow steps in "Deploy to Cloud" section above

# Option 2: Run locally
npm install && npm run build-vercel && npm start
# Then visit http://localhost:3000
```

---

**Questions?** Check the [Deployment Guide](DEPLOY_TO_VERCEL.md) or test locally first with `npm start`.
```
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
