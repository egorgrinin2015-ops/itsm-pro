const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получение всех категорий
router.get('/', categoryController.getCategories);

// Получение одной категории
router.get('/:id', categoryController.getCategoryById);

// Создание категории (только менеджеры)
router.post('/', categoryController.createCategory);

// Обновление категории (только менеджеры)
router.put('/:id', categoryController.updateCategory);

// Удаление категории (только менеджеры)
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;