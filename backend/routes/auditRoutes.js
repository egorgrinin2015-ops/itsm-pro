const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');

// Все роуты требуют авторизации
router.use(authMiddleware);

// Роуты (только для менеджеров)
router.get('/', auditController.getAll);
router.get('/entities', auditController.getEntities);
router.get('/user/:userId', auditController.getUserActivity);
router.get('/:id', auditController.getById);

module.exports = router;
