#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
const frontendPath = path.join(__dirname, 'frontend', 'dist');

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// Load game routes
try {
  const gameRoutes = require('./backend/dist/routes/game.js').default;
  app.use('/api/game', gameRoutes);
} catch (e) {
  console.error('Could not load game routes:', e.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for SPA routing
app.use((req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found');
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n✓ Energy Game Server Running`);
  console.log(`✓ http://localhost:${PORT}\n`);
  
  // Auto-open browser using system command
  setTimeout(() => {
    console.log('✓ Opening browser...\n');
    if (process.platform === 'win32') {
      exec(`start http://localhost:${PORT}`);
    } else if (process.platform === 'darwin') {
      exec(`open http://localhost:${PORT}`);
    } else {
      exec(`xdg-open http://localhost:${PORT}`);
    }
  }, 1500);
});

process.on('SIGINT', () => {
  console.log('\n✓ Shutting down...');
  server.close(() => process.exit(0));
});
