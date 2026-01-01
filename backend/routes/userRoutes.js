const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получение списка инженеров (доступно всем авторизованным)
router.get('/engineers', userController.getEngineers);

// Получение всех пользователей (только для менеджеров и админов)
router.get('/', userController.getAllUsers);

// Получение пользователя по ID
router.get('/:id', userController.getUserById);

// Создание пользователя (только для менеджеров и админов)
router.post('/', userController.createUser);

// Обновление пользователя
router.put('/:id', userController.updateUser);

// Блокировка/разблокировка пользователя
router.patch('/:id/toggle-status', userController.toggleUserStatus);

// Сброс пароля
router.patch('/:id/reset-password', userController.resetPassword);

// Удаление пользователя
router.delete('/:id', userController.deleteUser);

module.exports = router;