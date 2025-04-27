const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/logout', viewController.logout);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/create-tour', authController.protect, authController.restrictTo('admin'), viewController.getCreateTourForm);
router.get('/manage-tours', authController.protect, authController.restrictTo('admin'), viewController.getManageTours);
router.get('/manage-users', authController.protect, authController.restrictTo('admin'), viewController.getManageUsers);
router.get('/manage-reviews', authController.protect, authController.restrictTo('admin'), viewController.getManageReviews);
router.get('/manage-bookings', authController.protect, authController.restrictTo('admin'), viewController.getManageBookings);
router.get('/my-bookings', authController.protect, viewController.getMyBookings);
router.get('/edit-tour/:id', authController.protect, authController.restrictTo('admin'), viewController.getEditTourForm);
// router.use(viewsController.alerts);

// router.get('/', authController.isLoggedIn, viewsController.getOverview);

// router.get('/my-tours', authController.protect, viewsController.getMyTours);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewController.updateUserData
// );

module.exports = router;
