#!/usr/bin/env node

/**
 * Energy Game - Standalone Executable Entry Point
 * This file is the entry point for the pkg-bundled executable
 */

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { writeFileSync, appendFileSync } from 'fs'
import { homedir } from 'os'
import open from 'open'
import gameRoutes from './backend/src/routes/game.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup logging to file
const logDir = path.join(homedir(), 'Energy-Game-Logs')
const logFile = path.join(logDir, 'game.log')

try {
  if (!existsSync(logDir)) {
    writeFileSync(logDir, '', { flag: 'a' })
  }
} catch (e) {
  // Directory might exist
}

const log = (msg) => {
  const timestamp = new Date().toISOString()
  const logMsg = `[${timestamp}] ${msg}\n`
  console.log(logMsg)
  try {
    appendFileSync(logFile, logMsg)
  } catch (e) {
    // Ignore log file errors
  }
}

log('=== Energy Game Starting ===')
log(`__dirname: ${__dirname}`)
log(`Process cwd: ${process.cwd()}`)

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Serve frontend static files
const frontendPath = path.join(__dirname, 'frontend/dist')
log(`Frontend path: ${frontendPath}`)
log(`Frontend exists: ${existsSync(frontendPath)}`)

app.use(express.static(frontendPath))

// Routes
log('Setting up API routes...')
app.use('/api/game', gameRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve index.html for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html')
  log(`Serving index.html: ${indexPath}`)
  res.sendFile(indexPath)
})

// Start server
try {
  app.listen(PORT, () => {
    log(`\n✓ Energy Game is starting...`)
    log(`✓ Server running on http://localhost:${PORT}\n`)
    
    // Auto-open browser
    setTimeout(() => {
      log('✓ Opening game in your browser...\n')
      open(`http://localhost:${PORT}`).catch((err) => {
        log(`⚠ Could not auto-open browser: ${err.message}`)
        log(`Visit http://localhost:${PORT} manually\n`)
      })
    }, 1000)
  })
} catch (err) {
  log(`ERROR starting server: ${err.message}`)
  log(err.stack)
  process.exit(1)
}

// Error handling
process.on('uncaughtException', (err) => {
  log(`UNCAUGHT EXCEPTION: ${err.message}`)
  log(err.stack)
})

process.on('unhandledRejection', (reason, promise) => {
  log(`UNHANDLED REJECTION: ${reason}`)
  log(`Promise: ${promise}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  log('\n✓ Closing Energy Game...')
  process.exit(0)
})

log('Entry point initialized successfully')

