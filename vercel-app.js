// Special Vercel entry point for serverless environment
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Basic middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Health check route - crucial for debugging Vercel deployments
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Vercel deployment is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not specified'
  });
});

// Debug route - provides detailed information about the environment
app.get('/_vercel/debug', (req, res) => {
  const directories = ['views', 'public', 'models', 'controller', 'router', 'utils'];
  const directoryCheck = {};

  directories.forEach(dir => {
    directoryCheck[dir] = fs.existsSync(path.join(__dirname, dir));
  });

  res.status(200).json({
    status: 'success',
    message: 'Vercel debug information',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    directories: directoryCheck,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    env: {
      DATABASE_URI: process.env.DATABASE_URI ? 'set (hidden)' : 'not set',
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'set (hidden)' : 'not set',
      PORT: process.env.PORT || 'using default'
    }
  });
});

// Home route - basic HTML to confirm the server is working
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>V-Nature - Vercel Deployment</title>
      <link rel="stylesheet" href="/css/vercel-debug.css">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 800px; margin: 0 auto; }
        .success { color: green; }
        .debug-link { display: inline-block; margin-top: 20px; padding: 10px 15px; 
                     background: #0070f3; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>V-Nature</h1>
        <p class="success">✅ Server is running on Vercel!</p>
        <p>This is a minimal page to confirm the deployment is working.</p>
        <a href="/_vercel/debug" class="debug-link">View Debug Information</a>
        <div class="vercel-deployment-check"></div>
      </div>
    </body>
    </html>
  `);
});

// Fallback route
app.use('*', (req, res) => {
  res.status(404).send('Page not found. Try the <a href="/">home page</a> or <a href="/_vercel/debug">debug page</a>.');
});

// Export for Vercel serverless deployment
module.exports = app;
