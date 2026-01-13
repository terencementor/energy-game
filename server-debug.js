#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const open = require('open');

console.log('=== Energy Game Server ===\n');
console.log(`Current directory: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);
console.log(`process.execPath: ${process.execPath}`);
console.log(`process.argv[0]: ${process.argv[0]}`);
console.log('');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Try multiple paths for frontend
const possiblePaths = [
  path.join(__dirname, 'frontend', 'dist'),
  path.join(process.cwd(), 'frontend', 'dist'),
  path.join(path.dirname(process.execPath), 'frontend', 'dist'),
  './frontend/dist',
];

let frontendPath = null;
for (const p of possiblePaths) {
  console.log(`Checking: ${p} - ${fs.existsSync(p) ? '✓' : '✗'}`);
  if (fs.existsSync(p)) {
    frontendPath = p;
    break;
  }
}

if (frontendPath) {
  console.log(`\n✓ Using frontend path: ${frontendPath}\n`);
  app.use(express.static(frontendPath));
} else {
  console.log('\n⚠ Frontend directory not found!\n');
  console.log('Available directories:');
  console.log(fs.readdirSync(__dirname).join(', '));
}

// Load game routes
try {
  const gameRoutes = require('./backend/dist/routes/game.js').default;
  console.log('✓ Game routes loaded');
  app.use('/api/game', gameRoutes);
} catch (e) {
  console.log(`✗ Could not load game routes: ${e.message}`);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for SPA routing
app.use((req, res) => {
  if (!frontendPath) {
    return res.status(500).send('Frontend not configured');
  }
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`Not found: ${indexPath}`);
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}\n`);
  
  // Auto-open browser
  setTimeout(async () => {
    console.log('✓ Opening browser...\n');
    try {
      await open(`http://localhost:${PORT}`);
    } catch (err) {
      console.log('Visit http://localhost:3000 in your browser\n');
    }
  }, 1500);
});

process.on('SIGINT', () => {
  console.log('\n✓ Shutting down...');
  server.close(() => process.exit(0));
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
