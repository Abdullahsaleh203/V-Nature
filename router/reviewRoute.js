const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

// make sure to use the same router instance as the parent route
// so that the mergeParams option works
const router = express.Router({ mergeParams: true });


router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('admin'),reviewController.setTourUserIds, reviewController.createReview);

router.route('/:id')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview)

module.exports = router;
