const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController')
const { protect, authorize } = require('../middleware/auth');  // protect routes from unauthorized users

router.post('/notify-member', protect, notificationController.notifyMember);
router.post('/notify-family', protect, notificationController.notifyFamily);
router.delete('/delete/:id', protect, notificationController.removeNotif);

module.exports = router;