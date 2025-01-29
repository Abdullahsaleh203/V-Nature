const express = require('express');
const tourroute = require('./../controller/tourController');

const app = express();
router = express.Router();

route
    .route('/')
    .get(tourroute.getAllTours)
    .post(tourroute.createTour);
    

router.route('/:id')
    .get(tourroute.getTour)
    .post(tourroute.createTour)
    .patch(tourroute.updateTour)
    .delete(tourroute.deleteTour);
