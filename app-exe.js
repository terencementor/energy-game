const express = require('express')
const cors = require('cors')
const path = require('path')
const { spawn } = require('child_process')
const open = require('open')
const { existsSync, appendFileSync, mkdirSync } = require('fs')
const os = require('os')

// Setup logging
const logDir = path.join(os.homedir(), 'Energy-Game-Logs')
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true })
}
const logFile = path.join(logDir, 'energy-game.log')

const log = (msg) => {
  const timestamp = new Date().toISOString()
  const logMsg = `[${timestamp}] ${msg}\n`
  console.log(msg)
  try {
    appendFileSync(logFile, logMsg)
  } catch (e) {
    // Ignore log errors
  }
}

log('=== Energy Game Starting ===')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Serve frontend
const frontendPath = path.join(__dirname, 'frontend/dist')
log(`Frontend path: ${frontendPath}`)
log(`Frontend exists: ${existsSync(frontendPath)}`)

if (existsSync(frontendPath)) {
  app.use(express.static(frontendPath))
} else {
  log('WARNING: Frontend dist not found!')
}

// Backend routes
try {
  const gameRoutes = require('./backend/dist/routes/game.js').default
  app.use('/api/game', gameRoutes)
  log('Game routes loaded')
} catch (err) {
  log(`Error loading game routes: ${err.message}`)
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html')
  if (existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send('Not found')
  }
})

app.listen(PORT, () => {
  log(`✓ Server running on http://localhost:${PORT}`)
  
  setTimeout(() => {
    log('✓ Opening browser...')
    open(`http://localhost:${PORT}`).catch(err => {
      log(`Note: Could not auto-open browser: ${err.message}`)
      log(`Please visit http://localhost:${PORT} manually`)
    })
  }, 1500)
})

process.on('uncaughtException', (err) => {
  log(`CRASH: ${err.message}`)
  log(err.stack)
})
