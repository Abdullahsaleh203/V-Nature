
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const appError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorHandel')
const tourRoute = require('./router/tourRoute');
const userRouter = require('./router/userRoute');
const helmet  = require('helmet');
const ExpressMongoSanitize = require('express-mongo-sanitize');


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

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

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


