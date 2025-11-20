const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Получение профиля (защищенный маршрут)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;