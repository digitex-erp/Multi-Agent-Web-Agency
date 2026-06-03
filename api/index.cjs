/**
 * Vercel serverless entry — loads the bundled Express app from dist/server.cjs.
 * Uses .cjs because package.json has "type": "module" (require() not allowed in .js).
 */
const path = require('path');
const fs = require('fs');
const express = require('express');

function loadApp() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.cjs');

  if (!fs.existsSync(serverPath)) {
    throw new Error(
      `Missing ${serverPath}. Vercel buildCommand must run "npm run build" before deploy.`
    );
  }

  const mod = require(serverPath);
  const app = mod.default ?? mod.app;

  if (!app || typeof app !== 'function') {
    throw new Error('dist/server.cjs did not export an Express app');
  }

  return app;
}

let app;

try {
  app = loadApp();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Failed to bootstrap Express app:', message);

  app = express();
  app.get('/api/health', (_req, res) => {
    res.status(503).json({ status: 'error', error: message, time: new Date().toISOString() });
  });
  app.use((_req, res) => {
    res.status(503).json({ success: false, error: message });
  });
}

module.exports = app;
