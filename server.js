const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE_URI;
mongoose.connect(DB)
    .then((result) => { console.log('connected to db .....') })
    .catch((err) => { console.log(err) });


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true , 'A tour must have a price']
    }
})

const Tour = mongoose.model('Tour', tourSchema);


// Middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
