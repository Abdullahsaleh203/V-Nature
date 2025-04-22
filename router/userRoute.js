/* eslint-disable */
const express = require('express');
const multer = require('multer');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const upload = multer({ dest: 'public/img/users' });
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);



router.use(authController.protect);



router.patch('/updateMyPassword',  
    authController.updatePassword);

router.get('/Me', 
    userController.getMe,
    userController.getUser)
router.patch('/updateMe',upload.single('photo'),
    userController.getMe,  
    userController.updateMe);
router.delete('/deleteMe',
    userController.getMe,  
    userController.deleteMe);

// only admin can access this route
router.use(authController.restrictTo('admin'));  
  
router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
