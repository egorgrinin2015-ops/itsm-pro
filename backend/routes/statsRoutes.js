const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Общая статистика
router.get('/overall', statsController.getOverallStats);

// Статистика по дням
router.get('/tickets-by-date', statsController.getTicketsByDate);

// Топ исполнители
router.get('/top-performers', statsController.getTopPerformers);

// SLA метрики
router.get('/sla-metrics', statsController.getSLAMetrics);

module.exports = router;