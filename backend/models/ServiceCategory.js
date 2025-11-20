const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceCategory = sequelize.define('ServiceCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slaTime: {
    type: DataTypes.INTEGER, // в минутах
    allowNull: false,
    defaultValue: 240 // 4 часа по умолчанию
  }
}, {
  tableName: 'service_categories',
  timestamps: true
});

module.exports = ServiceCategory;