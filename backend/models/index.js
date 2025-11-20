const sequelize = require('../config/database');
const User = require('./User');
const Ticket = require('./Ticket');
const Comment = require('./Comment');
const Subtask = require('./Subtask');
const ServiceCategory = require('./ServiceCategory');

// Определение связей между моделями

// User -> Ticket (один пользователь может создать много заявок)
User.hasMany(Ticket, { foreignKey: 'userId', as: 'createdTickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> Ticket (инициатор)
User.hasMany(Ticket, { foreignKey: 'initiatorId', as: 'initiatedTickets' });
Ticket.belongsTo(User, { foreignKey: 'initiatorId', as: 'initiator' });

// User -> Ticket (ответственный)
User.hasMany(Ticket, { foreignKey: 'assignedTo', as: 'assignedTickets' });
Ticket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// ServiceCategory -> Ticket
ServiceCategory.hasMany(Ticket, { foreignKey: 'categoryId' });
Ticket.belongsTo(ServiceCategory, { foreignKey: 'categoryId', as: 'category' });

// Ticket -> Comment
Ticket.hasMany(Comment, { foreignKey: 'ticketId', as: 'comments' });
Comment.belongsTo(Ticket, { foreignKey: 'ticketId' });

// User -> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Ticket -> Subtask
Ticket.hasMany(Subtask, { foreignKey: 'ticketId', as: 'subtasks' });
Subtask.belongsTo(Ticket, { foreignKey: 'ticketId' });

// User -> Subtask
User.hasMany(Subtask, { foreignKey: 'assignedTo', as: 'assignedSubtasks' });
Subtask.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

module.exports = {
  sequelize,
  User,
  Ticket,
  Comment,
  Subtask,
  ServiceCategory
};