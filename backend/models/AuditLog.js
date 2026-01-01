const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.ENUM('create', 'update', 'delete', 'login', 'logout', 'view', 'export', 'assign', 'status_change'),
    allowNull: false
  },
  entity: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  entityName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  oldValues: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  newValues: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['action'] },
    { fields: ['entity'] },
    { fields: ['createdAt'] }
  ]
});

// Хелпер для создания записи аудита
AuditLog.log = async function(data) {
  try {
    return await this.create(data);
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

module.exports = AuditLog;
