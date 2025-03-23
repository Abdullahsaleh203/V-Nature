const reviewController = require('./../controller/reviewController');
const express = require('express');
const router = express.Router();


router.route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview);



module.exports = router;
