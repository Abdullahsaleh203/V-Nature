const express = require('express');
const userRoute = require('./../controller/userController');
const authController = require('./../controller/authController');
const router = express.Router();

router.post('/signup', authController.signup);

router.route('/')
    .get(userRoute.getAllUsers)
    .post(userRoute.createUser);

router.route('/:id')
    .get(userRoute.getUser)
    .patch(userRoute.updateUser)
    .delete(userRoute.deleteUser);

module.exports = router;
