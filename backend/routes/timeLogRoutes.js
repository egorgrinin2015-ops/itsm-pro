const express = require('express');
const router = express.Router();
const timeLogController = require('../controllers/timeLogController');
const authMiddleware = require('../middleware/authMiddleware');

// Все роуты требуют аутентификации
router.use(authMiddleware);

// Добавить лог времени к заявке
router.post('/tickets/:ticketId/time-logs', timeLogController.addTimeLog);

// Получить логи времени для заявки
router.get('/tickets/:ticketId/time-logs', timeLogController.getTicketTimeLogs);

// Получить мои логи времени
router.get('/time-logs/my', timeLogController.getMyTimeLogs);

// Получить статистику (только для менеджеров/админов)
router.get('/time-logs/stats', timeLogController.getTimeStats);

// Обновить лог времени
router.put('/time-logs/:id', timeLogController.updateTimeLog);

// Удалить лог времени
router.delete('/time-logs/:id', timeLogController.deleteTimeLog);

module.exports = router;