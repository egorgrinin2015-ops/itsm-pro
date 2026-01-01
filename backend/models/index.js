const sequelize = require('../config/database');
const User = require('./User');
const Ticket = require('./Ticket');
const Comment = require('./Comment');
const Subtask = require('./Subtask');
const ServiceCategory = require('./ServiceCategory');
const TimeLog = require('./TimeLog');
const Equipment = require('./Equipment');
const EquipmentHistory = require('./EquipmentHistory');
const AuditLog = require('./AuditLog'); // ← НОВОЕ: аудит!

// ===== СВЯЗИ ДЛЯ TICKET =====

// User -> Ticket (создатель заявки) - ИСПОЛЬЗУЕМ userId КАК ЕСТЬ В БД
User.hasMany(Ticket, { foreignKey: 'userId', as: 'createdTickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// User -> Ticket (инициатор)
User.hasMany(Ticket, { foreignKey: 'initiatorId', as: 'initiatedTickets' });
Ticket.belongsTo(User, { foreignKey: 'initiatorId', as: 'initiator' });

// User -> Ticket (назначенный исполнитель)
User.hasMany(Ticket, { foreignKey: 'assignedTo', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });

// ServiceCategory -> Ticket
ServiceCategory.hasMany(Ticket, { foreignKey: 'categoryId', as: 'tickets' });
Ticket.belongsTo(ServiceCategory, { foreignKey: 'categoryId', as: 'category' });

// ===== СВЯЗИ ДЛЯ COMMENT =====

// Ticket -> Comment
Ticket.hasMany(Comment, { foreignKey: 'commentId', as: 'comments' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// User -> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// ===== СВЯЗИ ДЛЯ SUBTASK =====

// Ticket -> Subtask
Ticket.hasMany(Subtask, { foreignKey: 'ticketId', as: 'subtasks' });
Subtask.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// User -> Subtask
User.hasMany(Subtask, { foreignKey: 'assignedTo', as: 'assignedSubtasks' });
Subtask.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// ===== СВЯЗИ ДЛЯ TIMELOG =====

// Ticket -> TimeLog
Ticket.hasMany(TimeLog, { foreignKey: 'ticketId', as: 'timeLogs' });
TimeLog.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// User -> TimeLog
User.hasMany(TimeLog, { foreignKey: 'userId', as: 'timeLogs' });
TimeLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ===== СВЯЗИ ДЛЯ EQUIPMENT (CMDB) =====

// User -> Equipment (ответственный за оборудование)
User.hasMany(Equipment, { foreignKey: 'assignedToId', as: 'equipment' });
Equipment.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });

// Equipment -> EquipmentHistory
Equipment.hasMany(EquipmentHistory, { foreignKey: 'equipmentId', as: 'history' });
EquipmentHistory.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

// User -> EquipmentHistory (кто внёс запись)
User.hasMany(EquipmentHistory, { foreignKey: 'userId', as: 'equipmentHistoryEntries' });
EquipmentHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Ticket -> EquipmentHistory (связанная заявка, если есть)
Ticket.hasMany(EquipmentHistory, { foreignKey: 'ticketId', as: 'equipmentHistoryEntries' });
EquipmentHistory.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });

// ===== СВЯЗИ ДЛЯ AUDITLOG =====

// User -> AuditLog
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Ticket,
  Comment,
  Subtask,
  ServiceCategory,
  Category: ServiceCategory,
  TimeLog,
  Equipment,
  EquipmentHistory,
  AuditLog // ← НОВОЕ!
};