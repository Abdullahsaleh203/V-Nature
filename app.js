const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./router/tourRoute');

const userRouter = require('./router/userRoute');
const appError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorHandel')

const app = express();
// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());





app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRouter);

// Middleware for unhandled routes
app.all('*', (req, res, next) => {
    // const error = new Error(`Can't find ${req.originalUrl} on this server`);
    // error.status = 'fail';
    // error.statusCode = 404;

    next(new appError(`Can't find ${req.originalUrl} on this server`,404));
});

app.use(globalErrorHandler);

module.exports = app;


