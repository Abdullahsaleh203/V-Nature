const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
// const slugify = require('slugify');
const app = express();
// Middleware
app.use(morgan('dev'));
app.use(express.json());


const PORT = process.env.PORT || 3000;

const tour = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours.json`

    ));
    

app.get('/test', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tour.length,
        tour
    })

});

app.post('/test', (req, res) => {
    const newId = tour[tour.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tour.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours.json`, JSON.stringify(tour), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    });
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
