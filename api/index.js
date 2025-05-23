// Special index.js entry point for Vercel serverless functions
// This file is useful for Vercel's default behavior

// Import our specialized vercel app
const app = require('./vercel-app');

// Export the Express app directly for Vercel serverless deployment
module.exports = app;
