const cron = require('node-cron');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const country = require('./models/country');

console.log(process.env.NODE_ENV)

const {sequelize} = require('./db/sequelize-pg');

const {DataTypes} = require('sequelize');
const {City} = require('./models/city');



const abc = async () => {
    const model = await country(sequelize, DataTypes).create({ name: 'china'});
    console.log(model)
}

// abc()

const forecastWeather = async () => {
    const result = await City.findOne();
    console.log( result.createdAt)
    console.log(result.updatedAt)
}

forecastWeather();


// cron.schedule('30 0-23 * * *', () => {
//     console.log('running');
// })





// app.listen(port, () => {
//     console.log(`Listening on port ${port}...`);
// });