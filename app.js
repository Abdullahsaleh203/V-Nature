/* eslint-disable */

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const appError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorHandel');
const tourRoute = require('./router/tourRoutes');
const userRouter = require('./router/userRoutes');
const reviewRouter = require('./router/reviewRoutes');
const viewRouter = require('./router/viewRoutes');
const bookingRouter = require('./router/bookingRoutes');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const bookingController = require('./controller/bookingController');
// const swaggerUi = require('swagger-ui-express');
// Set view engine to pug
app.set('view engine', 'pug');
// Set views directory to views 
app.set('views', path.join(__dirname, 'views'));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Middleware

// Enable CORS for all routes
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set security HTTP headers
app.use(
  helmet(
    // {
    // contentSecurityPolicy: {
      // directives: {
        // defaultSrc: ["'self'", 'http://127.0.0.1:*', 'http://localhost:*'],
        // scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com', 'http://127.0.0.1:*', 'http://localhost:*'],
        // connectSrc: ["'self'", 'ws://localhost:*', 'http://localhost:*', 'ws://127.0.0.1:*', 'http://127.0.0.1:*', 'https://js.stripe.com'],
        // imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        // styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        // fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        // frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
        // objectSrc: ["'none'"],
        // upgradeInsecureRequests: []
      // },
    // },
    // crossOriginEmbedderPolicy: false,
    // crossOriginResourcePolicy: { policy: "cross-origin" },
    // crossOriginOpenerPolicy: false
    // }
  )
);


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

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
app.use(compression());
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Add request time to request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
})
// Routes

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

// Middleware for unhandled routes
app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
