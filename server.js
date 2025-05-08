const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const app = require('./app');

// Database connection - optimized for serverless
const DB = process.env.DATABASE_URI;
let cachedDb = null;

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }
    
    try {
        const client = await mongoose.connect(DB, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10 // Optimize for serverless
        });
        
        cachedDb = client;
        console.log('MongoDB connection successful');
        return client;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
};

// Connect to database
connectToDatabase().catch(console.dir);

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
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
}

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

module.exports = app; // Export app for serverless environments


