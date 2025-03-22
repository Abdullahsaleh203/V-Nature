const reviewModel = require('../models/reviewModel');
const asyncHandler = require('./../utils/asyncHandler');
const appError = require('./../utils/appError');


// GET ALL REVIEWS
exports.getAllReviews = asyncHandler(async (req, res, next) => { 
    const review = await reviewModel.find();
    res.status(200).json({
        status: 'success',
        results: review.length,
        data: {
            review
        }
    });
});

//create a review
exports.createReview = asyncHandler(async (req, res, next) => { 
    const review = await reviewModel.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    });
});
