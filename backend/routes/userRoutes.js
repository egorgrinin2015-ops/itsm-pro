const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получение списка инженеров (для назначения на заявки)
router.get('/engineers', userController.getEngineers);

module.exports = router;