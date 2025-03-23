const reviewController = require('./../controller/reviewController');
const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('admin'),reviewController.createReview);



module.exports = router;
