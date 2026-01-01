const AuditLog = require('../models/AuditLog');

const auditService = {
  // Логирование создания
  logCreate: async (req, entity, entityId, entityName, newValues = null) => {
    await AuditLog.log({
      userId: req.user?.id,
      action: 'create',
      entity,
      entityId,
      entityName,
      newValues,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      details: `Создано: ${entityName}`
    });
  },

  // Логирование обновления
  logUpdate: async (req, entity, entityId, entityName, oldValues = null, newValues = null) => {
    await AuditLog.log({
      userId: req.user?.id,
      action: 'update',
      entity,
      entityId,
      entityName,
      oldValues,
      newValues,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      details: `Изменено: ${entityName}`
    });
  },

  // Логирование удаления
  logDelete: async (req, entity, entityId, entityName, oldValues = null) => {
    await AuditLog.log({
      userId: req.user?.id,
      action: 'delete',
      entity,
      entityId,
      entityName,
      oldValues,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      details: `Удалено: ${entityName}`
    });
  },

  // Логирование входа
  logLogin: async (req, userId, userName) => {
    await AuditLog.log({
      userId,
      action: 'login',
      entity: 'user',
      entityId: userId,
      entityName: userName,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      details: `Вход в систему: ${userName}`
    });
  },

  // Логирование выхода
  logLogout: async (req) => {
    await AuditLog.log({
      userId: req.user?.id,
      action: 'logout',
      entity: 'user',
      entityId: req.user?.id,
      entityName: req.user?.fullName,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      details: `Выход из системы: ${req.user?.fullName}`
    });
  },

  // Логирование изменения статуса
  logStatusChange: async (req, entity, entityId, entityName, oldStatus, newStatus) => {
    await AuditLog.log({
      userId: req.user?.id,
      action: 'status_change',
      entity,
      entityId,
      entityName,
      oldValues: { status: oldStatus },
      newValues: { status: newStatus },
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      details: `Статус изменён: ${oldStatus} → ${newStatus}`
    });
  },

  // Логирование назначения
  logAssign: async (req, entity, entityId, entityName, assignedToName) => {
    await AuditLog.log({
      userId: req.user?.id,
      action: 'assign',
      entity,
      entityId,
      entityName,
      newValues: { assignedTo: assignedToName },
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
      details: `Назначено на: ${assignedToName}`
    });
  }
};

module.exports = auditService;
