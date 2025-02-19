const express = require('express');
const tourRoute = require('./../controller/tourController');

const router = express.Router();

// router.param('id',(req,res,next,val)=>{
//     console.log(`Tour id is: ${val}`);
//     next();
// });

router.route('/top-5-cheap')
    .get(tourRoute.aliasTopTours, tourRoute.getAllTours);

router.route('/tour-stats')
    .get(tourRoute.getTourStats);
router.route('/monthly-plan/:year')
    .get(tourRoute.getMonthPlan);
    
router
    .route('/')
    .get(tourRoute.getAllTours)
    .post(tourRoute.createTour);
    

router.route('/:id')
    .get(tourRoute.getTour)
    .post(tourRoute.createTour)
    .patch(tourRoute.updateTour)
    .delete(tourRoute.deleteTour);

module.exports = router;
