/* eslint-disable */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to load environment variables from .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('Loading environment variables from .env file');
    dotenv.config({ path: envPath });
} else {
    console.log('No .env file found, using environment variables from the system');
}

const app = require('./app');

// Optimize database connection with connection pooling
const DB = process.env.DATABASE_URI;
const connectWithRetry = () => {
    if (!DB) {
        console.error('⚠️ DATABASE_URI environment variable is not defined!');
        // Don't fail hard in production - allow the app to start without DB
        if (process.env.NODE_ENV === 'production') {
            console.log('Running in production without database connection');
            return;
        } else {
            console.error('Please set DATABASE_URI in your environment variables or .env file');
            process.exit(1);
        }
    }

    console.log('Attempting to connect to MongoDB...');

    mongoose.connect(DB)
        .then(() => {
            console.log('✅ MongoDB connection successful');
        })
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err);
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

const PORT = process.env.PORT || 3000;

// Special route for Vercel deployment troubleshooting
app.get('/_vercel/deployment/check', (req, res) => {
    const envVars = {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        DATABASE_URI: process.env.DATABASE_URI ? 'is set (hidden)' : 'not set',
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ? 'is set (hidden)' : 'not set',
        PORT: process.env.PORT || 'not set (using default)',
    };

    res.status(200).json({
        status: 'success',
        message: 'Vercel deployment check',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        envVarsStatus: envVars,
        directoryStructure: {
            views: fs.existsSync(path.join(__dirname, 'views')),
            publicFolder: fs.existsSync(path.join(__dirname, 'public')),
            controllers: fs.existsSync(path.join(__dirname, 'controller')),
            models: fs.existsSync(path.join(__dirname, 'models')),
        }
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});


