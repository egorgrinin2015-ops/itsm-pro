const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Получение комментариев заявки
router.get('/ticket/:ticketId', commentController.getComments);

// Добавление комментария
router.post('/ticket/:ticketId', commentController.addComment);

// Удаление комментария
router.delete('/:id', commentController.deleteComment);

module.exports = router;