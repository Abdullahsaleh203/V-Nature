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
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Add this line

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
// Import passport config
require('./utils/passport');

// PERFORMANCE OPTIMIZATIONS
// Apply compression for all responses
app.use(compression({
  level: 6, // Higher compression level (0-9, 9 is max but slower)
  threshold: 0 // Compress all responses
}));

// Set view engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files with cache headers
const oneYear = 31536000000;
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: oneYear,
  etag: true,
  lastModified: true
}));

// CORS setup
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'https://*.mapbox.com', 'https://*.stripe.com'],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://*.mapbox.com',
          'https://api.mapbox.com',
          'https://js.stripe.com',
          'https://api.stripe.com'
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://*.mapbox.com',
          'https://fonts.googleapis.com' // Added Google Fonts
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com' // Added Google Fonts
        ],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
        imgSrc: ["'self'", 'data:', 'https://*.mapbox.com'],
        connectSrc: [
          "'self'",
          'https://*.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://api.stripe.com',
          'https://js.stripe.com'
        ]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Add this before any express.json() middleware
app.post(
  '/api/v1/booking/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// Body parser with optimized limits
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Security middleware
app.use(mongoSanitize());
app.use(xss());
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

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Initialize session for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport and use session for persistent login
app.use(passport.initialize());
app.use(passport.session());

// Add request time to request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes - keep these optimized
app.use('/', viewRouter);
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
