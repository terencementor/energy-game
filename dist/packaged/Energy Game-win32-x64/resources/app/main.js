const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs')

let mainWindow
let backendProcess

// Setup logging
const logFile = path.join(app.getPath('userData'), 'app.log')
const log = (message) => {
  const timestamp = new Date().toISOString()
  const fullMessage = `[${timestamp}] ${message}\n`
  console.log(fullMessage)
  fs.appendFileSync(logFile, fullMessage, { encoding: 'utf8' })
}

log('App starting...')

// Spawn the backend server
function startBackendServer() {
  try {
    const backendPath = path.join(__dirname, 'backend/dist/index.js')
    const backendDir = path.join(__dirname, 'backend')
    
    log(`Backend path: ${backendPath}`)
    log(`Backend dir: ${backendDir}`)
    log(`Backend exists: ${fs.existsSync(backendPath)}`)
    
    backendProcess = spawn('node', [backendPath], {
      cwd: backendDir,
      stdio: 'inherit'
    })

    backendProcess.on('error', (err) => {
      log(`Failed to start backend: ${err.message}`)
    })
    
    log('Backend process spawned')
  } catch (err) {
    log(`Error starting backend: ${err.message}`)
  }
}

// Create the browser window
function createWindow() {
  try {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    })

    const frontendPath = path.join(__dirname, 'frontend/dist/index.html')
    const startUrl = `file://${frontendPath}`
    
    log(`Frontend path: ${frontendPath}`)
    log(`Frontend exists: ${fs.existsSync(frontendPath)}`)
    log(`Loading URL: ${startUrl}`)
    
    mainWindow.loadURL(startUrl)
    mainWindow.webContents.openDevTools()
    
    log('Window created and URL loaded')

    mainWindow.on('closed', () => {
      mainWindow = null
      if (backendProcess) {
        backendProcess.kill()
      }
    })
  } catch (err) {
    log(`Error creating window: ${err.message}`)
  }
}

app.on('ready', () => {
  log('App ready event fired')
  startBackendServer()
  
  // Give backend time to start
  setTimeout(() => {
    log('Creating window after 3 second delay')
    createWindow()
  }, 3000)
})

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
