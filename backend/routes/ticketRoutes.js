const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

// Получить все заявки (с фильтрами)
router.get('/', authMiddleware, ticketController.getTickets);

// Получить статистику заявок
router.get('/stats', authMiddleware, ticketController.getTicketStats);

// НОВОЕ: Получить загруженность инженеров
router.get('/engineers-load', authMiddleware, ticketController.getEngineersLoad);

// Получить заявку по ID
router.get('/:id', authMiddleware, ticketController.getTicketById);

// Создать новую заявку
router.post('/', authMiddleware, ticketController.createTicket);

// Обновить статус заявки
router.patch('/:id/status', authMiddleware, ticketController.updateTicketStatus);

// Назначить исполнителя
router.patch('/:id/assign', authMiddleware, ticketController.assignTicket);

// Обновить заявку
router.put('/:id', authMiddleware, ticketController.updateTicket);

// Удалить заявку
router.delete('/:id', authMiddleware, ticketController.deleteTicket);

module.exports = router;