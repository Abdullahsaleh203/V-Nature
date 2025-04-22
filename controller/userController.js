/* eslint-disable */
const fs = require('fs');
const User = require('./../models/userModel');
const asyncHandler = require('./../utils/asyncHandler');
const appError = require('../utils/appError');


const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  })
  return newObj;

};

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getMe = (req,res, next)=>{
  req.params.id = req.user.id
  next()
}


exports.updateMe = asyncHandler(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // 1) Create error if POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError('This route is not for password updates. Please use /updateMe.', 400));
  };
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUser = asyncHandler(async (req, res, nex) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new appError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
