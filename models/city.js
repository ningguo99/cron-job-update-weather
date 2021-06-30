const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize-pg');
const { DataTypeNoTz } = require('../utils/date-utils');
const { Country } = require('./country');

module.exports.City = sequelize.define('city', {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.TEXT
    },
    latitude: {
        type: DataTypes.DOUBLE
    },
    longitude: {
        type: DataTypes.DOUBLE
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
            model: Country,
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

