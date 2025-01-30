const express = require('express');


const userRoute = require('./../controller/userController');

const router = express.Router();

router.route('/')
    .get(userRoute.getAllUsers)
    .post(userRoute.createUser);

router.route('/:id')
    .get(userRoute.getUser)
    .patch(userRoute.updateUser)
    .delete(userRoute.deleteUser);

module.exports = router;
