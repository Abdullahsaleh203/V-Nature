const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const app = require('./app');

// Optimize database connection with connection pooling
const DB = process.env.DATABASE_URI;
const connectWithRetry = () => {
    mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
        serverSelectionTimeoutMS: 5000, // Give up initial connection after 5 seconds
        heartbeatFrequencyMS: 10000, // Check connection every 10 seconds
    })
        .then(() => {
            console.log('MongoDB connection successful');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

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

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});


