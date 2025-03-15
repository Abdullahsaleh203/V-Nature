
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const appError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorHandel')
const tourRoute = require('./router/tourRoute');
const userRouter = require('./router/userRoute');
const { default: helmet } = require('helmet');


const app = express();

// Set security HTTP headers
app.use(helmet());
// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// app.use(express.static(`${__dirname}/public`));

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Add request time to request object
app.use((req,res ,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
})

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRouter);

// Middleware for unhandled routes
app.all('*', (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

module.exports = app;


