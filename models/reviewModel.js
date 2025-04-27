const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
	{

		review: {
			type: String,
			required: [true, "Review can't be empty!"]
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true
		},
		createdAt: {
			type: Date,
			default: Date.now()
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			required: [true, 'Review must belong to a tour']
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review must belong to a user']
		}

	});


// Prevent user from submitting more than one review per tour
reviewSchema.index({tour:1,user:1},{unique:true});

// Populate user and tour fields when querying reviews
reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'tour',
		select: 'name'
	}).populate({
		path: 'user',
		select: 'name photo'
	});
	next();
});


reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const statics = await this.aggregate([
		{
			$match: { tour: tourId }
		},
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' }
			}
		}
	]);
	// this points to current model 
	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: statics[0].nRating,
		ratingsAverage: statics[0].avgRating
	});
};

reviewSchema.post('save', function () {
	// this points to current review
	this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^fineOneAnd/, async function (next) { 
	this.r = await this.findOne();
	next();
	// 
});

reviewSchema.post(/^fineOneAnd/, async function () {
	// this.r = await this.findOne(); // does NOT work here, query has already executed
	await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
