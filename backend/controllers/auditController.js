const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { Op } = require('sequelize');

const auditController = {
  // Получить логи
  getAll: async (req, res) => {
    try {
      const { 
        search, userId, action, entity, 
        startDate, endDate, 
        page = 1, limit = 50 
      } = req.query;
      
      const where = {};

      if (search) {
        where[Op.or] = [
          { entityName: { [Op.iLike]: `%${search}%` } },
          { details: { [Op.iLike]: `%${search}%` } }
        ];
      }
      if (userId) where.userId = userId;
      if (action) where.action = action;
      if (entity) where.entity = entity;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate + 'T23:59:59');
      }

      const offset = (page - 1) * limit;
      const { count, rows: logs } = await AuditLog.findAndCountAll({
        where,
        include: [
          { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'role'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      // Статистика
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stats = {
        total: await AuditLog.count(),
        today: await AuditLog.count({ where: { createdAt: { [Op.gte]: today } } }),
        creates: await AuditLog.count({ where: { action: 'create', createdAt: { [Op.gte]: today } } }),
        updates: await AuditLog.count({ where: { action: 'update', createdAt: { [Op.gte]: today } } }),
        deletes: await AuditLog.count({ where: { action: 'delete', createdAt: { [Op.gte]: today } } }),
        logins: await AuditLog.count({ where: { action: 'login', createdAt: { [Op.gte]: today } } })
      };

      res.json({
        logs,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          current: parseInt(page),
          limit: parseInt(limit)
        },
        stats
      });
    } catch (error) {
      console.error('Ошибка получения аудита:', error);
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Получить детали записи
  getById: async (req, res) => {
    try {
      const log = await AuditLog.findByPk(req.params.id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'fullName', 'email', 'role'] }
        ]
      });
      if (!log) return res.status(404).json({ message: 'Запись не найдена' });
      res.json({ log });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Получить активность пользователя
  getUserActivity: async (req, res) => {
    try {
      const { userId } = req.params;
      const { days = 7 } = req.query;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const logs = await AuditLog.findAll({
        where: {
          userId,
          createdAt: { [Op.gte]: startDate }
        },
        order: [['createdAt', 'DESC']],
        limit: 100
      });

      res.json({ logs });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Получить список сущностей для фильтра
  getEntities: async (req, res) => {
    try {
      const entities = await AuditLog.findAll({
        attributes: ['entity'],
        group: ['entity'],
        raw: true
      });
      res.json({ entities: entities.map(e => e.entity) });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  }
};

module.exports = auditController;
