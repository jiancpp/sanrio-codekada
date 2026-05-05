const express = require('express');
const router = express.Router();
const dailyLogController = require('../controllers/dailyLogController');

router.post('/add', dailyLogController.createLog);
router.get('/family/:familyCode', dailyLogController.getFamilyLogs);
router.get('/streak/:familyCode', dailyLogController.getFamilyStreak);
router.get('/user/:userId', dailyLogController.getUserLogs);

module.exports = router;
