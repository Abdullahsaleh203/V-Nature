const express = require('express');
// const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();
const viewController = require('../controller/viewController');

router.get('/', viewController.getOverview);


// router.get('/tours', (req, res) => {
//     res.status(200).render('tours', {
//         title: 'The Forest Hiker Tour'
//     });
// });

module.exports = router;
