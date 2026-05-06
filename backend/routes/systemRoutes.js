const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController')
const activityController = require('../controllers/recentActivityController')
const summaryController = require('../controllers/summaryController')
const { protect, authorize } = require('../middleware/auth');  // protect routes from unauthorized users

// Notifications
router.post('/notify-member', protect, authorize(['Manager']), notificationController.notifyMember);
router.post('/notify-family', protect, authorize(['Manager']), notificationController.notifyFamily);
router.delete('/delete/:id', protect, notificationController.removeNotif);

// Recent Activity
router.get('/get-activity/:familyId', protect, activityController.getRecentActivity);
router.post('/post-activity', protect, authorize(['Manager']), activityController.postRecentActivity);

// Summary
router.get('/get-summary', protect, summaryController.getMonthlySummary);
router.post('/generate-summary', protect, summaryController.generateMonthlySummary);

module.exports = router;