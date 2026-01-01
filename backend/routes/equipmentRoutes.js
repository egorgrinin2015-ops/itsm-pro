const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Статистика (перед :id)
router.get('/stats', equipmentController.getStats);

// QR-код поиск
router.get('/qr/:qrCode', equipmentController.getByQR);

// Оборудование пользователя
router.get('/user/:userId', equipmentController.getByUser);

// CRUD
router.get('/', equipmentController.getAll);
router.get('/:id', equipmentController.getById);
router.post('/', equipmentController.create);
router.put('/:id', equipmentController.update);
router.delete('/:id', equipmentController.delete);

// История
router.get('/:id/history', equipmentController.getHistory);
router.post('/:id/history', equipmentController.addHistoryEntry);

module.exports = router;