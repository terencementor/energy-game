#!/usr/bin/env node

/**
 * Energy Game - Standalone Executable Launcher
 * Launches backend server and opens browser
 */

const { spawn } = require('child_process')
const path = require('path')
const os = require('os')
const { existsSync, appendFileSync, mkdirSync } = require('fs')

// Setup logging
const logDir = path.join(os.homedir(), 'Energy-Game-Logs')
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true })
}
const logFile = path.join(logDir, 'game.log')

const log = (msg) => {
  const timestamp = new Date().toISOString()
  const logMsg = `[${timestamp}] ${msg}\n`
  console.log(msg)
  try {
    appendFileSync(logFile, logMsg)
  } catch (e) {
    // Ignore
  }
}

log('=== Energy Game Starting ===')
log(`Node: ${process.version}`)
log(`Platform: ${process.platform}`)

// Get the directory where the exe is running from
const appDir = process.argv[1] ? path.dirname(process.argv[1]) : __dirname

log(`App directory: ${appDir}`)

// The backend server file
const backendPath = path.join(appDir, 'backend/dist/index.js')

log(`Backend path: ${backendPath}`)
log(`Backend exists: ${existsSync(backendPath)}`)

// Start backend server
log('Starting backend server...')

const backend = spawn(process.execPath, [backendPath], {
  cwd: path.join(appDir, 'backend'),
  stdio: 'inherit',
  detached: false
})

backend.on('error', (err) => {
  log(`Backend spawn error: ${err.message}`)
  process.exit(1)
})

backend.on('exit', (code) => {
  log(`Backend exited with code ${code}`)
  process.exit(code)
})

// Open browser after a delay
setTimeout(() => {
  log('Opening browser...')
  const { exec } = require('child_process')
  
  // Windows command to open URL
  if (process.platform === 'win32') {
    exec('start http://localhost:3000')
  } else if (process.platform === 'darwin') {
    exec('open http://localhost:3000')
  } else {
    exec('xdg-open http://localhost:3000')
  }
}, 2000)

// Graceful shutdown
process.on('SIGINT', () => {
  log('Shutting down...')
  backend.kill()
  process.exit(0)
})
