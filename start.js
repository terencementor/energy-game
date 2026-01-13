#!/usr/bin/env node

const path = require('path')
const { spawn } = require('child_process')
const http = require('http')

// Start backend server
const backendPath = path.join(__dirname, 'backend/dist/index.js')
const backend = spawn('node', [backendPath], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
})

console.log('Backend server started...')

// Wait for backend to be ready
setTimeout(() => {
  // Start Electron
  const electron = require('electron')
  const app = electron.app
  const BrowserWindow = electron.BrowserWindow
  
  const createWindow = () => {
    const mainWindow = new BrowserWindow({
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
    console.log('Loading frontend from:', frontendPath)
    mainWindow.loadURL(`file://${frontendPath}`)
    mainWindow.webContents.openDevTools()
  }
  
  app.on('ready', createWindow)
  
  app.on('window-all-closed', () => {
    backend.kill()
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length === 0) {
      createWindow()
    }
  })
}, 2000)
