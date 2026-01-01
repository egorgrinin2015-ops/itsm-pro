const Equipment = require('../models/Equipment');
const EquipmentHistory = require('../models/EquipmentHistory');
const User = require('../models/User');
const { Op } = require('sequelize');

const equipmentController = {
  // Получить всё оборудование
  getAll: async (req, res) => {
    try {
      const { search, type, status, assignedToId, department, location, page = 1, limit = 20 } = req.query;
      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { serialNumber: { [Op.iLike]: `%${search}%` } },
          { inventoryNumber: { [Op.iLike]: `%${search}%` } },
          { manufacturer: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } }
        ];
      }
      if (type) where.type = type;
      if (status) where.status = status;
      if (assignedToId) where.assignedToId = assignedToId;
      if (department) where.department = { [Op.iLike]: `%${department}%` };
      if (location) where.location = { [Op.iLike]: `%${location}%` };

      const offset = (page - 1) * limit;
      const { count, rows: equipment } = await Equipment.findAndCountAll({
        where,
        include: [{ model: User, as: 'assignedTo', attributes: ['id', 'fullName', 'email'] }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      // Статистика
      const total = await Equipment.count();
      const active = await Equipment.count({ where: { status: 'active' } });
      const repair = await Equipment.count({ where: { status: 'repair' } });
      const inactive = await Equipment.count({ where: { status: 'inactive' } });
      const writtenOff = await Equipment.count({ where: { status: 'written_off' } });
      const storage = await Equipment.count({ where: { status: 'storage' } });

      const byType = await Equipment.findAll({
        attributes: ['type', [Equipment.sequelize.fn('COUNT', Equipment.sequelize.col('id')), 'count']],
        group: ['type'],
        raw: true
      });

      res.json({
        equipment,
        pagination: { total: count, pages: Math.ceil(count / limit), current: parseInt(page), limit: parseInt(limit) },
        stats: { total, active, repair, inactive, writtenOff, storage, byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: parseInt(item.count) }), {}) }
      });
    } catch (error) {
      console.error('Ошибка получения оборудования:', error);
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Получить по ID
  getById: async (req, res) => {
    try {
      const equipment = await Equipment.findByPk(req.params.id, {
        include: [{ model: User, as: 'assignedTo', attributes: ['id', 'fullName', 'email', 'role'] }]
      });
      if (!equipment) return res.status(404).json({ message: 'Оборудование не найдено' });
      res.json({ equipment });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Получить по QR-коду
  getByQR: async (req, res) => {
    try {
      const equipment = await Equipment.findOne({
        where: { qrCode: req.params.qrCode },
        include: [{ model: User, as: 'assignedTo', attributes: ['id', 'fullName', 'email'] }]
      });
      if (!equipment) return res.status(404).json({ message: 'Оборудование не найдено' });
      res.json({ equipment });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Создать
  create: async (req, res) => {
    try {
      const { name, type, manufacturer, model, serialNumber, inventoryNumber, specifications, status, location, department, assignedToId, purchaseDate, warrantyUntil, purchasePrice, notes, ipAddress, macAddress } = req.body;
      if (!name) return res.status(400).json({ message: 'Название обязательно' });

      const equipment = await Equipment.create({ name, type, manufacturer, model, serialNumber, inventoryNumber, specifications, status, location, department, assignedToId, purchaseDate, warrantyUntil, purchasePrice, notes, ipAddress, macAddress });

      await EquipmentHistory.create({
        equipmentId: equipment.id, eventType: 'created',
        description: `Оборудование "${name}" добавлено в систему`,
        userId: req.user.id, details: { type, status }
      });

      if (assignedToId) {
        const assignedUser = await User.findByPk(assignedToId);
        await EquipmentHistory.create({
          equipmentId: equipment.id, eventType: 'assigned',
          description: `Назначено пользователю: ${assignedUser?.fullName || 'Неизвестно'}`,
          userId: req.user.id, details: { assignedToId, assignedToName: assignedUser?.fullName }
        });
      }

      res.status(201).json({ message: 'Оборудование создано', equipment });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Оборудование с таким серийным/инвентарным номером уже существует' });
      }
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Обновить
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const equipment = await Equipment.findByPk(id);
      if (!equipment) return res.status(404).json({ message: 'Оборудование не найдено' });

      const oldData = equipment.toJSON();

      // Логируем изменение статуса
      if (updates.status && updates.status !== oldData.status) {
        await EquipmentHistory.create({
          equipmentId: id, eventType: 'status_change',
          description: `Статус изменён: ${oldData.status} → ${updates.status}`,
          userId: req.user.id, details: { oldStatus: oldData.status, newStatus: updates.status }
        });
      }

      // Логируем изменение назначения
      if (updates.assignedToId !== undefined && updates.assignedToId !== oldData.assignedToId) {
        if (updates.assignedToId) {
          const newUser = await User.findByPk(updates.assignedToId);
          await EquipmentHistory.create({
            equipmentId: id, eventType: 'assigned',
            description: `Назначено пользователю: ${newUser?.fullName || 'Неизвестно'}`,
            userId: req.user.id, details: { oldAssignedToId: oldData.assignedToId, newAssignedToId: updates.assignedToId }
          });
        } else if (oldData.assignedToId) {
          await EquipmentHistory.create({
            equipmentId: id, eventType: 'unassigned',
            description: 'Снято с пользователя', userId: req.user.id,
            details: { oldAssignedToId: oldData.assignedToId }
          });
        }
      }

      // Логируем перемещение
      if (updates.location && updates.location !== oldData.location) {
        await EquipmentHistory.create({
          equipmentId: id, eventType: 'relocation',
          description: `Перемещено: ${oldData.location || 'Не указано'} → ${updates.location}`,
          userId: req.user.id, details: { oldLocation: oldData.location, newLocation: updates.location }
        });
      }

      await equipment.update(updates);
      const updatedEquipment = await Equipment.findByPk(id, {
        include: [{ model: User, as: 'assignedTo', attributes: ['id', 'fullName', 'email'] }]
      });

      res.json({ message: 'Оборудование обновлено', equipment: updatedEquipment });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Удалить
  delete: async (req, res) => {
    try {
      const equipment = await Equipment.findByPk(req.params.id);
      if (!equipment) return res.status(404).json({ message: 'Оборудование не найдено' });
      await EquipmentHistory.destroy({ where: { equipmentId: req.params.id } });
      await equipment.destroy();
      res.json({ message: 'Оборудование удалено' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Добавить запись в историю
  addHistoryEntry: async (req, res) => {
    try {
      const { id } = req.params;
      const { eventType, description, details, cost, ticketId } = req.body;
      const equipment = await Equipment.findByPk(id);
      if (!equipment) return res.status(404).json({ message: 'Оборудование не найдено' });

      const historyEntry = await EquipmentHistory.create({ equipmentId: id, eventType, description, details, cost, ticketId, userId: req.user.id });
      res.status(201).json({ message: 'Запись добавлена', historyEntry });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Получить историю
  getHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const equipment = await Equipment.findByPk(id);
      if (!equipment) return res.status(404).json({ message: 'Оборудование не найдено' });

      const offset = (page - 1) * limit;
      const { count, rows: history } = await EquipmentHistory.findAndCountAll({
        where: { equipmentId: id },
        include: [{ model: User, as: 'user', attributes: ['id', 'fullName'] }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit), offset
      });

      res.json({ history, pagination: { total: count, pages: Math.ceil(count / limit), current: parseInt(page) } });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Оборудование пользователя
  getByUser: async (req, res) => {
    try {
      const equipment = await Equipment.findAll({ where: { assignedToId: req.params.userId }, order: [['name', 'ASC']] });
      res.json({ equipment });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  },

  // Статистика
  getStats: async (req, res) => {
    try {
      const total = await Equipment.count();
      const active = await Equipment.count({ where: { status: 'active' } });
      const repair = await Equipment.count({ where: { status: 'repair' } });
      const inactive = await Equipment.count({ where: { status: 'inactive' } });
      const storage = await Equipment.count({ where: { status: 'storage' } });
      const writtenOff = await Equipment.count({ where: { status: 'written_off' } });

      const byType = await Equipment.findAll({
        attributes: ['type', [Equipment.sequelize.fn('COUNT', Equipment.sequelize.col('id')), 'count']],
        group: ['type'], raw: true
      });

      const warrantyExpiring = await Equipment.count({
        where: { warrantyUntil: { [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] } }
      });

      const recentHistory = await EquipmentHistory.findAll({
        include: [
          { model: User, as: 'user', attributes: ['id', 'fullName'] },
          { model: Equipment, as: 'equipment', attributes: ['id', 'name', 'type'] }
        ],
        order: [['createdAt', 'DESC']], limit: 10
      });

      res.json({
        stats: { total, active, repair, inactive, storage, writtenOff, warrantyExpiring, byType: byType.reduce((acc, item) => ({ ...acc, [item.type]: parseInt(item.count) }), {}) },
        recentHistory
      });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
  }
};

module.exports = equipmentController;