import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// In-memory game instances
const games = {}

// Simple game state getter
function getOrCreateGame(gameId = 'default') {
  if (!games[gameId]) {
    games[gameId] = {
      id: gameId,
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
  }
  return games[gameId]
}

app.use(cors())
app.use(express.json())

// Serve static files from frontend/dist
const frontendPath = path.join(__dirname, '../frontend/dist')
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath))
}

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Placeholder API routes - just return basic responses
app.get('/api/game/state', (req, res) => {
  const gameId = req.query.gameId || 'default'
  const game = getOrCreateGame(gameId)
  res.json(game)
})

app.get('/api/game/units', (req, res) => {
  res.json([
    { id: 'engine', name: 'Engine', cost: 50000 },
    { id: 'turbine', name: 'Turbine', cost: 45000 },
    { id: 'solar', name: 'Solar Panel', cost: 500000 },
    { id: 'wind', name: 'Wind Turbine', cost: 300000 },
    { id: 'coal', name: 'Coal Plant', cost: 3000000 },
    { id: 'nuclear', name: 'Nuclear Plant', cost: 8000000 },
    { id: 'battery', name: 'Battery', cost: 100000 },
  ])
})

app.post('/api/game/buy-unit', (req, res) => {
  const gameId = req.body.gameId || 'default'
  const game = getOrCreateGame(gameId)
  res.json({ success: true, state: game })
})

app.post('/api/game/toggle-unit', (req, res) => {
  const gameId = req.body.gameId || 'default'
  const game = getOrCreateGame(gameId)
  res.json({ success: true, state: game })
})

app.post('/api/game/start', (req, res) => {
  const gameId = req.body.gameId || 'default'
  const game = getOrCreateGame(gameId)
  game.gameActive = true
  res.json({ success: true, state: game })
})

app.post('/api/game/update', (req, res) => {
  const gameId = req.body.gameId || 'default'
  const game = getOrCreateGame(gameId)
  res.json(game)
})

app.post('/api/game/set-speed', (req, res) => {
  const gameId = req.body.gameId || 'default'
  const game = getOrCreateGame(gameId)
  game.gameSpeed = req.body.speed || 1
  res.json({ success: true, state: game })
})

app.post('/api/game/restart', (req, res) => {
  const gameId = req.body.gameId || 'default'
  games[gameId] = getOrCreateGame(gameId)
  res.json({ success: true, state: games[gameId] })
})

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

export default app

