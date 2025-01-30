const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE_URI;
mongoose.connect(DB)
    .then((result) => { console.log('connected to db .....') })
    .catch((err) => { console.log(err) });


// Middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

const PORT = process.env.PORT || 3000;

  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
