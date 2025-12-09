const express = require('express');
const router = express.Router();

console.log('🔵 SLA ROUTES LOADED!');

const slaController = require('../controllers/slaController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Статистика SLA
router.get('/stats', (req, res, next) => {
  console.log('🟢 SLA STATS REQUEST RECEIVED');
  slaController.getSlaStats(req, res, next);
});

// Проверка нарушений SLA
router.get('/breaches', (req, res, next) => {
  console.log('🟡 SLA BREACHES REQUEST RECEIVED');
  slaController.checkSlaBreaches(req, res, next);
});

// Статус SLA для заявки
router.get('/ticket/:id', (req, res, next) => {
  console.log('🟠 SLA TICKET STATUS REQUEST RECEIVED for ID:', req.params.id);
  slaController.getTicketSlaStatus(req, res, next);
});

console.log('✅ SLA ROUTES CONFIGURED');

module.exports = router;