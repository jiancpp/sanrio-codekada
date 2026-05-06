const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');
const { protect, authorize } = require('../middleware/auth');  // protect routes from unauthorized users


router.get('/get/:code', protect, familyController.getFamily);
router.post('/create', familyController.createFamily);
router.post('/join', familyController.joinFamily);
router.put('/update-name', familyController.updateFamilyName);

module.exports = router;
