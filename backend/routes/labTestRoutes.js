const express = require('express');
const router = express.Router();
const labTestController = require('../controllers/labTestController')
const { protect, authorize } = require('../middleware/auth');  // protect routes from unauthorized users

router.post('/add', protect, labTestController.createLabTest);
router.get('/member/:familyCode/:member', protect, labTestController.getMemberTests);
router.get('/family/:familyCode', protect, labTestController.getFamilyTests);
router.delete('/delete/:id', protect, labTestController.deleteLabTest);

module.exports = router;