const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();
router.use(authController.isLoggedIn);

router.get('/',viewController.getOverview);
router.get('/tour/:slug',viewController.getTour);
router.get('/login', viewController.getLoginForm);
// router.use(viewsController.alerts);

// router.get('/', authController.isLoggedIn, viewsController.getOverview);

// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
// router.get('/me', authController.protect, viewsController.getAccount);

// router.get('/my-tours', authController.protect, viewsController.getMyTours);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
