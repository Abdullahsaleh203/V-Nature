const express = require('express');
const tourRoute = require('../controller/tourController');
const authController = require('../controller/authController');
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
    // .get(tourRoute.getAllTours)
    .get(authController.protect,authController.restrictTo('admin','lead-guide'),tourRoute.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourRoute.createTour);


router.route('/:id')
    .get(authController.protect,tourRoute.getTour)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourRoute.createTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourRoute.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourRoute.deleteTour);

module.exports = router;
