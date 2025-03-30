const express = require('express');
const tourRoute = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewController = require('./../controller/reviewController');
const reviewRoter = require('./reviewRoute');
const router = express.Router({mergeParams: true});


// nested routes: tour/:tourId/reviews
router.use('/:tourId/reviews', reviewRoter);

// router.param('id',(req,res,next,val)=>{
//     console.log(`Tour id is: ${val}`);
//     next();
// });

router.route('/top-5-cheap')
    .get(tourRoute.aliasTopTours, tourRoute.getAllTours);

router.route('/tour-stats')
    .get(tourRoute.getTourStats);
router.route('/monthly-plan/:year')
    .get(authController.protect, 
        authController.restrictTo('admin', 'lead-guide','guide'),
        tourRoute.getMonthPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourRoute.getTourWithin);        
router.route('/distances/:latlng/unit/:unit').get(tourRoute.getDistances);

router.route('/')
    // .get(tourRoute.getAllTours)
    .get(tourRoute.getAllTours)
    .post(authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourRoute.createTour);


router.route('/:id')
    .get(tourRoute.getTour)
    .post(authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourRoute.createTour)
    .patch(authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourRoute.updateTour)
    .delete(authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourRoute.deleteTour);

// reviews tour
// Nested routes
// router.route('/:tourId/reviews')
//     .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
//     .get(reviewController.getAllReviews);
module.exports = router;
