const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');  // protect routes from unauthorized users

// Note: api route starts with 'BASE_URL/api/users/...'
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser)
router.put('/profile/edit-info/:id', protect, userController.editMemberInfo)
router.get('/get/:id', protect, userController.getMemberInfo);

module.exports = router;
