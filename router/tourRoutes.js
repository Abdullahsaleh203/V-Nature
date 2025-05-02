const express = require('express');
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');
const reviewRoter = require('./reviewRoutes');
const router = express.Router({ mergeParams: true });


// nested routes: tour/:tourId/reviews
router.use('/:tourId/reviews', reviewRoter);

// router.param('id',(req,res,next,val)=>{
//     console.log(`Tour id is: ${val}`);
//     next();
// });

router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats')
    .get(tourController.getTourStats);
router.route('/monthly-plan/:year')
    .get(authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router.route('/')
    // .get(tourController.getAllTours)
    .get(tourController.getAllTours)
    .post(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour);


router.route('/:id')
    .get(tourController.getTour)
    .post(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour)
    .patch(authController.protect,
        authController.restrictTo('admin', 'lead-guide'), tourController.uploadToureImages, tourController.resizeTourImages,
        tourController.updateTour)
    .delete(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour);

// reviews tour
// Nested routes
// router.route('/:tourId/reviews')
//     .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
//     .get(reviewController.getAllReviews);
module.exports = router;
