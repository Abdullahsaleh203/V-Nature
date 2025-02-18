const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

// CURD OPERATIONS

// GET ALL TOURS
exports.getAllTours = async(req, res) => {
  try {
    // BUILD QUERY
    
    // 1A) Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);
    
    // 1B) Advanced Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    
    // let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    // if (req.query.sort) {
    //   // query = query.sort(req.query.sort);
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    //  }
     // 3) Limiting the fields
    //  if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    //  } else {
    //   query = query.select('-__v');
    //  }
     // 4) Pagination

    //   const page = req.query.page * 1 || 1;
    //   const limit = req.query.limit *1 || 100;
    //   const skip = (page -1 ) * limit;
    //   query = query.skip(skip).limit(limit);
    //   if (req.query.page) {
    //     const numTours = await Tour.countDocuments();
    //     if (skip >= numTours) throw new Error('This page does not exist');
    // }
    
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(JSON.parse(queryStr)), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await  features.query;
    /* const tours = await Tour.find().where('duration')
    .equals(5)
    .where('difficulty').
    equals('easy'); */
    
    // const tours = await Tour.find(req.query);
    // console.log(req.requestTime);
    // requestedAt: req.requestTime,

    
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
  });
} catch (err) {
  res.status(404).json({
    status: 'fail',
    message: err
  });
};
}
// GET A SINGLE TOUR
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({_id: req.params.id});  // same as above
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     Tour
  //   }
  // });
};
// POST : CREATE A TOUR
exports.createTour =async (req, res) => {
try{
  // const newTour = new Tour({});
  // newTour.save()
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
})
} catch (err) {
  res.status(400).json({
    status: 'fail',
    message: err
  });
  }
};


// PATCH : UPDATE A TOUR
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};

// DELETE : DELETE A TOUR
exports.deleteTour = async(req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) { 
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};
