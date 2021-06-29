const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize-pg');
const { DataTypeNoTz } = require('../utils/date-utils');

module.exports.Country = sequelize.define('country', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.TEXT
  },
  createdAt: {
    type: DataTypes.DATE, get() {
      return DataTypeNoTz(this.getDataValue('createdAt'));
    }
  },
  updatedAt: {
    type: DataTypes.DATE, get() {
      return DataTypeNoTz(this.getDataValue('updatedAt'));
    }
  }
}, {
  freezeTableName: true,
  underscored: true,
  createdAt: false,
  updatedAt: false
});