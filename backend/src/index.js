import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import gameRoutes from './routes/game.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const publicPath = path.join(__dirname, 'public')
const distPath = path.join(__dirname, '../../frontend/dist')

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath))
} else if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
}

app.use('/api/game', gameRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('*', (req, res) => {
  const indexPath = path.join(publicPath || distPath, 'index.html')
  res.sendFile(indexPath, { root: '/' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
