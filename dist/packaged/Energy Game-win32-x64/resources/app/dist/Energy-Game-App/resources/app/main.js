const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const isDev = require('electron-is-dev')

let mainWindow
let backendProcess

// Spawn the backend server
function startBackendServer() {
  const backendPath = isDev 
    ? path.join(__dirname, 'backend/dist/index.js')
    : path.join(process.resourcesPath, 'backend/dist/index.js')
  
  backendProcess = spawn('node', [backendPath], {
    cwd: isDev ? path.join(__dirname, 'backend') : path.join(process.resourcesPath, 'backend'),
    stdio: 'inherit'
  })

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err)
  })
}

// Create the browser window
function createWindow() {
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

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../frontend/dist/index.html')}`

  mainWindow.loadURL(startUrl)

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
    if (backendProcess) {
      backendProcess.kill()
    }
  })
}

app.on('ready', () => {
  startBackendServer()
  
  // Give backend time to start
  setTimeout(() => {
    createWindow()
  }, 2000)
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
