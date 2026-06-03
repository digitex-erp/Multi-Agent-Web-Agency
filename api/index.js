/**
 * Vercel serverless entry — loads the bundled Express app from dist/server.cjs.
 * buildCommand must run `npm run build` first (creates dist/server.cjs + static assets).
 */
const path = require('path');
const fs = require('fs');

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

module.exports = app;
