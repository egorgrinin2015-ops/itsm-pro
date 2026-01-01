const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EquipmentHistory = sequelize.define('EquipmentHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  equipmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'equipment',
      key: 'id'
    }
  },
  eventType: {
    type: DataTypes.ENUM(
      'created', 'assigned', 'unassigned', 'status_change', 'repair',
      'maintenance', 'upgrade', 'relocation', 'note', 'warranty_claim', 'written_off'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tickets',
      key: 'id'
    }
  },
  cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  }
}, {
  tableName: 'equipment_history',
  timestamps: true,
  updatedAt: false
});

module.exports = EquipmentHistory;