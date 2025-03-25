const asyncHandler = require('./../utils/asyncHandler');
const appError = require('./../utils/appError');

// delete a document
exports.deleteOne = Model => asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError('No document found with that ID', 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

// Update a document
exports.updateOne = Model => asyncHandler(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body,{
          new: true,
          runValidators: true
        });
      if (!doc) {
        return next(new appError('No document found with that ID', 404))
      }
        res.status(200).json({
          status: 'success',
          data: {
            doc
          }
        });
    });

// Create a document
exports.createOne = Model => asyncHandler(async (req, res,next) => {
        const doc = await Model.create(req.body);
      
        res.status(201).json({
          status: 'success',
          data: {
            date: doc
          }
        })
      })
      
// Get documents by query
exports.getAll = (Model, popOptions) => asyncHandler(async (req, res, next) => {
    let query = Model.find();
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc
        }
    });
});
// Get one document by ID
exports.getOne = (Model, popOptions) => asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new appError('No document found with that ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});
