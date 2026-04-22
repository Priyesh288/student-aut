const express = require('express');
const router = express.Router();
const {
    registerStudent,
    loginStudent,
    updatePassword,
    updateCourse,
    getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.put('/update-password', protect, updatePassword);
router.put('/update-course', protect, updateCourse);
router.get('/me', protect, getMe);

module.exports = router;
