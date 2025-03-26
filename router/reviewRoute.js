const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

// make sure to use the same router instance as the parent route
// so that the mergeParams option works
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('admin'),
    reviewController.setTourUserIds, 
    reviewController.createReview);

// router.use(authController.restrictTo('user', 'admin'));
router.route('/:id')
    .get(reviewController.gerReview)
    .patch(authController.restrictTo('user', 'admin'),
    reviewController.updateReview)
    .delete(authController.restrictTo('user', 'admin'),
    reviewController.deleteReview)

module.exports = router;
