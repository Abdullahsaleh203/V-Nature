const mongoose =require('mongoose')

const reviewSchema = mongoose.Schema(
{
	
review:{
	string,
	require :[true,"Review can't be empty!"]
	},
	ratting:{
		type:number,
		min:1,
		mix:5,
		require:true
	},
	createAt:{
		type:Date,
		default:Date.now()
	}, 
	tour:{
		type :mongoose.Schema.ObjectId,
		ref:'Tour',
		require:[true,'Review must belong to a tour']
	}, 
	user:{
		type :mongoose.Schema.ObjectId,
		ref:'User',
		require:[true,'Review must belong to a user']
	}

});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;
