const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the connection

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Auto-validates that it looks like an email
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  otp_expires_at: {
    type: DataTypes.DATE, // Maps to TIMESTAMP
    allowNull: true,
  },
  reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reset_token_expires_at: {
    type: DataTypes.DATE, // Maps to TIMESTAMP
    allowNull: true,
  },
}, {
  tableName: 'users', // Forces the table name to be 'users' (lowercase)
  timestamps: true,   // Automatically creates 'createdAt' and 'updatedAt'
  createdAt: 'created_at', // Rename default createdAt to match your SQL preference
  updatedAt: false,        // Disable updatedAt if you don't want it (or set column name)
});

module.exports = User;