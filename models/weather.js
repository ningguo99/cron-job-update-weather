const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/sequelize-pg');
const { DataTypeNoTz } = require('../utils/date-utils');
const { City } = require('./city');

module.exports.Weather = sequelize.define('weather', {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    dt: {
        type: DataTypes.DATE
    },
    tempMin: {
        type: DataTypes.DOUBLE
    },
    tempMax: {
        type: DataTypes.DOUBLE
    },
    pressure: {
        type: DataTypes.DOUBLE
    },
    humidity: {
        type: DataTypes.DOUBLE
    },
    condition: {
        type: DataTypes.TEXT
    },
    cloudiness: {
        type: DataTypes.DOUBLE
    },
    windSpeed: {
        type: DataTypes.DOUBLE
    },
    windDirection: {
        type: DataTypes.DOUBLE
    },
    precipitation: {
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
    cityId: {
        type: DataTypes.UUIDV4, references: {
            model: City,
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