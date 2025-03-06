
 express = require('express');
const morgan = require('morgan');

const appError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorHandel')
const tourRoute = require('./router/tourRoute');
const userRouter = require('./router/userRoute');


const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());

// app.use(express.static(`${__dirname}/public`));

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


