// This script runs during Vercel builds to prepare the application
const fs = require('fs');
const path = require('path');

console.log('Running Vercel build script...');

// Ensure necessary directories exist
const directories = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'public', 'js'),
  path.join(__dirname, 'public', 'css'),
  path.join(__dirname, 'public', 'img')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create a simple diagnostic file to check if the build script ran
fs.writeFileSync(
  path.join(__dirname, 'public', 'vercel-build-check.txt'),
  `Build completed at ${new Date().toISOString()}\n`
);

console.log('Vercel build script completed successfully!');
