/**
 * Vercel serverless entry — loads the bundled Express app from dist/server.cjs.
 * Requires `npm run build` to run first (creates dist/server.cjs + static assets).
 */
const mod = require('../dist/server.cjs');
const app = mod.default ?? mod.app ?? mod;

module.exports = app;
