const { Sequelize } = require('sequelize');
require('dotenv').config();


module.exports.sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    // port:5432,
    host: process.env.PGHOST,
    dialect: 'postgres'
});