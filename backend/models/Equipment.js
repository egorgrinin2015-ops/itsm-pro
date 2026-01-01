const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipment = sequelize.define('Equipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('computer', 'laptop', 'monitor', 'printer', 'scanner', 'phone', 'network', 'server', 'other'),
    allowNull: false,
    defaultValue: 'computer'
  },
  manufacturer: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  inventoryNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  qrCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  specifications: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'repair', 'written_off', 'storage'),
    defaultValue: 'active',
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  warrantyUntil: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  macAddress: {
    type: DataTypes.STRING(17),
    allowNull: true
  }
}, {
  tableName: 'equipment',
  timestamps: true,
  hooks: {
    beforeCreate: (equipment) => {
      if (!equipment.qrCode) {
        equipment.qrCode = `EQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
    }
  }
});

module.exports = Equipment;