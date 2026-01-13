#!/usr/bin/env node

/**
 * Build script to create a standalone executable
 * Bundles backend + frontend into a single server file
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const outfile = path.join(__dirname, 'standalone-server.js');

console.log('Building standalone server bundle...');

esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'backend/src/index.ts')],
  outfile,
  bundle: true,
  platform: 'node',
  target: 'node18',
  external: ['express', 'cors', 'open'],
  loader: {
    '.ts': 'ts'
  }
});

console.log(`✓ Bundled to: ${outfile}`);
