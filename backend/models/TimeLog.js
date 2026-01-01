const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimeLog = sequelize.define('TimeLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ticket_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  hoursSpent: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    field: 'hours_spent',
    validate: {
      min: 0.01,
      max: 24.00
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'time_logs',
  timestamps: true,
  underscored: true
});

module.exports = TimeLog;