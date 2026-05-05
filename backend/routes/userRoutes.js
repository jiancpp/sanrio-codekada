const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');  // protect routes from unauthorized users

// Note: api route starts with 'BASE_URL/api/users/...'
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser)
router.put('/profile/edit/:id', userController.editMemberInfo)
router.put('/profile/edit-med/:id', userController.editMemberInfo)
router.get('/family/:code', userController.getFamily);

module.exports = router;
