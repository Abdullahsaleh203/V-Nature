const mongoose =require('mongoose');


const reviewSchema = mongoose.Schema(
{
	
review:{
	type: String,
	required :[true,"Review can't be empty!"]
	},
	rating:{
		type: Number,
		min:1,
		max:5,
		required: true
	},
	createAt:{
		type:Date,
		default:Date.now()
	}, 
	tour:{
		type :mongoose.Schema.ObjectId,
		ref:'Tour',
		required:[true,'Review must belong to a tour']
	}, 
	user:{
		type :mongoose.Schema.ObjectId,
		ref:'User',
		required:[true,'Review must belong to a user']
	}

});


// Prevent user from submitting more than one review per tour
// reviewSchema.index({tour:1,user:1},{unique:true});

// Populate user and tour fields when querying reviews
reviewSchema.pre(/^find/,function(next){
	this.populate({
		path:'tour',
		select:'name'
	}).populate({
	path:'user',
	select:'name photo'
	});
	next();
});


const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;
