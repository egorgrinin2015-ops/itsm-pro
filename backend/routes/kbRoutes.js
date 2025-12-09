const express = require('express');
const router = express.Router();
const kbController = require('../controllers/kbController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получение всех статей (с фильтрами и поиском)
router.get('/', kbController.getArticles);

// Популярные статьи
router.get('/popular', kbController.getPopularArticles);

// Получение одной статьи
router.get('/:id', kbController.getArticleById);

// Создание статьи (только менеджеры)
router.post('/', kbController.createArticle);

// Обновление статьи (только менеджеры)
router.put('/:id', kbController.updateArticle);

// Удаление статьи (только менеджеры)
router.delete('/:id', kbController.deleteArticle);

// Оценка полезности статьи
router.post('/:id/rate', kbController.rateArticle);

module.exports = router;