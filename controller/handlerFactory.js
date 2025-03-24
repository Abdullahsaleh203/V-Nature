


// 
const deleteOne = Model => asyncHandler(async (req, res) => {

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new appError('No documentation found with that ID', 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
    })

});
