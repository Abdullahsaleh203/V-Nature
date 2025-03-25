


// 
const deleteOne = Model => asyncHandler(async (req, res) => {

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new appError('No document found with that ID', 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
    })

});

// Update a document
const updateOne = Model => asyncHandler(async (req, res, next) => {
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

