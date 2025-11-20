const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Получение подзадач заявки
router.get('/ticket/:ticketId', subtaskController.getSubtasks);

// Создание подзадачи
router.post('/ticket/:ticketId', subtaskController.createSubtask);

// Обновление подзадачи
router.put('/:id', subtaskController.updateSubtask);

// Удаление подзадачи
router.delete('/:id', subtaskController.deleteSubtask);

module.exports = router;