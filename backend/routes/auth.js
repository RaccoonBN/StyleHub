const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Route đăng ký
router.post('/register', authController.register);

// Route đăng nhập
router.post('/login', authController.login);

module.exports = router;
