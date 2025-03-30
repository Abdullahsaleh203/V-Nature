const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const asyncHandler = require('./../utils/asyncHandler');
const appError = require('./../utils/appError');
const factory = require('./handlerFactory');
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


// CURD OPERATIONS
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTour = factory.getOne(Tour);
exports.getAllTours = factory.getAll(Tour);

exports.getTourWithin = asyncHandler(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    return next(new appError('Please provide latitude and longitude in the format lat,lng.', 400));
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

// GET DISTANCES FROM A POINT TO ALL TOURS
exports.getDistances = asyncHandler(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    return next(new appError('Please provide latitude and longitude in the format lat,lng.', 400));
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    results: distances.length,
    data: {
      data: distances
    }
  });
});

// GET ALL TOURS
// exports.getAllTours = asyncHandler(async (req, res, next) => {
//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//   const tours = await features.query;


//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours
//       }
//     });
// });
  
// GET A SINGLE TOUR
// exports.getTour = asyncHandler(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // const tour = await Tour.findOne({_id: req.params.id});  // same as above
//   if (!tour) {
//     return next(new appError('No tour found with that ID', 404))
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });

//   });
  

  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     Tour
  //   }
  // });

// POST : CREATE A TOUR
// exports.createTour = asyncHandler(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   })
// })





// PATCH : UPDATE A TOUR
// exports.updateTour = asyncHandler(async (req, res,next) => {

//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
//       new: true,
//       runValidators: true
//     });
//   if (!tour) {
//     return next(new appError('No tour found with that ID', 404))
//   }
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour
//       }
//     });
// });

// DELETE : DELETE A TOUR
// exports.deleteTour = asyncHandler(async(req, res) => {

//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new appError('No tour found with that ID', 404))
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null
//   })

// });
// AGGREGATION PIPELINE
exports.getTourStats = asyncHandler(async (req, res,next) => {

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper:'$difficulty'},
          // _id: null,
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: -1 }
      }
      // ,{
      //   $match: { _id: { $ne: 'easy' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });

});
// GET MONTHLY PLAN
exports.getMonthPlan = asyncHandler(async (req, res,next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
       }
       ,{
        $match : {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
         }
        },{

          $group : {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields :{ month: '$_id' }
        },{
          $project :{ _id: 0 }
        },{
          $sort:{ numTourStarts :-1 }
      },{
        $limit : 12
      }
      
    ])
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
})
