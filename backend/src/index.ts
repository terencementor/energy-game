import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import gameRoutes from './routes/game.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app: any = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Serve frontend static files - check multiple paths
const publicPath = path.join(__dirname, 'public')
const distPath = path.join(__dirname, '../../frontend/dist')

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath))
} else if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
}

// Routes
app.use('/api/game', gameRoutes)

// Health check
app.get('/api/health', (req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve index.html for all non-API routes (SPA routing)
app.get('*', (req: any, res: any) => {
  const indexPath = path.join(publicPath || distPath, 'index.html')
  res.sendFile(indexPath, { root: '/' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

