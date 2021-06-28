const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize-pg');
const country = require('./country');
const { DataTypeNoTz } = require('../utils/date-utils');


module.exports.City = sequelize.define('city', {
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
    },
    countryId: {
        type: DataTypes.UUIDV4, references: {
            model: country,
            key: 'id',
            // deferrable: INITIALLY_IMMEDIATE
        }
    }
}, {
    freezeTableName: true,
    underscored: true,
    createdAt: false,
    updatedAt: false
});
