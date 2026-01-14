import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Game from '../backend/src/models/Game.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// In-memory game instances
const games = {
  default: new Game('default'),
}

app.use(cors())
app.use(express.json())

// API routes
app.get('/api/game/state', (req, res) => {
  const gameId = req.query.gameId || 'default'
  const game = games[gameId]
  if (!game) return res.status(404).json({ error: 'Game not found' })
  res.json(game.getState())
})

app.get('/api/game/units', (req, res) => {
  const gameId = req.query.gameId || 'default'
  let game = games[gameId]
  if (!game) {
    game = new Game(gameId)
    games[gameId] = game
  }
  res.json(game.getEnergyUnitTypes())
})

app.post('/api/game/buy-unit', (req, res) => {
  const gameId = req.body.gameId || 'default'
  let game = games[gameId]
  if (!game) {
    game = new Game(gameId)
    games[gameId] = game
  }
  const success = game.buyEnergyUnit(req.body.typeId)
  res.json({ success, state: game.getState() })
})

app.post('/api/game/toggle-unit', (req, res) => {
  const gameId = req.body.gameId || 'default'
  const game = games[gameId]
  if (!game) return res.status(404).json({ error: 'Game not found' })
  const success = game.toggleUnit(req.body.unitId)
  res.json({ success, state: game.getState() })
})

app.post('/api/game/start', (req, res) => {
  const gameId = req.body.gameId || 'default'
  let game = games[gameId]
  if (!game) {
    game = new Game(gameId)
    games[gameId] = game
  }
  game.startGame()
  res.json({ success: true, state: game.getState() })
})

app.post('/api/game/update', (req, res) => {
  const gameId = req.body.gameId || 'default'
  let game = games[gameId]
  if (!game) {
    game = new Game(gameId)
    games[gameId] = game
  }
  game.update()
  res.json(game.getState())
})

app.post('/api/game/set-speed', (req, res) => {
  const gameId = req.body.gameId || 'default'
  const game = games[gameId]
  if (!game) return res.status(404).json({ error: 'Game not found' })
  game.setGameSpeed(req.body.speed)
  res.json({ success: true, state: game.getState() })
})

app.post('/api/game/restart', (req, res) => {
  const gameId = req.body.gameId || 'default'
  let game = games[gameId]
  if (!game) {
    game = new Game(gameId)
    games[gameId] = game
  }
  game.restartGame()
  res.json({ success: true, state: game.getState() })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist')
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath))
}

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).json({ error: 'Frontend not found' })
  }
})

export default app
