const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const app = require('./app');
const morgan = require('morgan');
// const DB = 'mongodb+srv://abdallahSaleh:abdallahGamal112@cluster0.svwdc.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
const DB = process.env.DATABASE_URI;
mongoose.connect(DB)
    .then((result) => { console.log('connected to db .....') })
    .catch((err) => { console.log(err) });

// const newTour = new Tour({
//     name: "tour 2",
//     price: 90
// })
// newTour.save()
//     .then(doc => {
//         console.log(doc);
//     })
//     .catch(err => {
//         console.log(err);
//     })

// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
