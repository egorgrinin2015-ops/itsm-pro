const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получение всех заявок (с фильтрами)
router.get('/', ticketController.getTickets);

// Получение одной заявки
router.get('/:id', ticketController.getTicketById);

// Создание заявки
router.post('/', ticketController.createTicket);

// Обновление заявки
router.put('/:id', ticketController.updateTicket);

// Удаление заявки (только менеджеры)
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;