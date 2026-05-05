const express = require('express');
const router = express.Router();
const familyController = require('../controllers/familyController');

router.post('/create', familyController.createFamily);
router.post('/join', familyController.joinFamily);
router.put('/update-name', familyController.updateFamilyName);

module.exports = router;
