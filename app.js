const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./router/toureRoute');

const userRouter = require('./router/userRoute');



const app = express();
// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());




    
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRouter);

module.exports = app;


