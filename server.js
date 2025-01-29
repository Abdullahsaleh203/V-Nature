const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const app = require('./app');



// Middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

const PORT = process.env.PORT || 3000;

  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
