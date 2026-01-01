const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticketNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'in_progress', 'on_hold', 'waiting', 'resolved', 'closed'),
    defaultValue: 'new',
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  slaDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Внешние ключи
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  initiatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'service_categories',
      key: 'id'
    }
  }
}, {
  tableName: 'tickets',
  timestamps: true,
  underscored: false
});

// АССОЦИАЦИИ - ЭТО ВАЖНО!
Ticket.associate = (models) => {
  // Создатель заявки
  Ticket.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  // Назначенный исполнитель
  Ticket.belongsTo(models.User, {
    foreignKey: 'assignedTo',
    as: 'assignedToUser'
  });

  // Категория
  Ticket.belongsTo(models.Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });

  // Комментарии
  Ticket.hasMany(models.Comment, {
    foreignKey: 'ticketId',
    as: 'comments'
  });
};

module.exports = Ticket;