const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


if (!registerUser) {
    console.log('registerUser is undefined');
}

if (!loginUser) {
    console.log('loginUser is undefined');
}

if (!logoutUser) {
    console.log('logoutUser is undefined');
}

if (!getUser) {
    console.log('getUser is undefined');
}

if (!protect) {
    console.log('protect is undefined');
}

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getUser); // Ensure this route exists

// console.log('Auth Routes Defined'); // Debug log

module.exports = router;
