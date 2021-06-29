const cron = require('node-cron');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;


console.log(process.env.NODE_ENV)

const { sequelize } = require('./db/sequelize-pg');



const { DataTypes, Sequelize } = require('sequelize');
const { City } = require('./models/city');
const { Country } = require('./models/country');
const { Weather } = require('./models/weather');

const Op = Sequelize.Op;

const tzlookup = require('tz-lookup');

const { DateTime } = require('luxon');
const { RoundAtDecimal } = require('./utils/math-utils');



const abc = async () => {
    const model = await Country(sequelize, DataTypes).create({ name: 'china' });
    console.log(model)
}


const weatherConditions = ['sunny', 'cloudy', 'windy', 'rainy', 'snowy'];

const generateRandomWeather = (dt, cityId) => {
    // random tempMin from -10 to 20 celsius
    const tempMin = RoundAtDecimal(RoundAtDecimal(Math.random() * 30, 2) - 10, 2);
    // random tempMax from 0 to 30 celsius
    const tempMax = RoundAtDecimal(tempMin + Math.floor(Math.random() * 11), 2);
    return {
        dt,
        tempMin,
        tempMax,
        // random pressure from 100000pa to 101325pa
        pressure: 100000 + Math.floor(Math.random() * 1326),
        // random humidity from 5 to 95 (%)
        humidity: 5 + Math.floor(Math.random() * 91),
        // random weather condition from list of 5 conditions
        condition: weatherConditions[Math.floor(Math.random() * 5)],
        // random cloudiness from 0 to 100 (%)
        cloudiness: Math.floor(Math.random() * 101),
        // random wind speed from 0.0 to 10.0 (m/s)
        windSpeed: RoundAtDecimal(Math.random() * 10, 1),
        // random wind direction from 0 to 360
        windDirection: Math.floor(Math.random() * 361),
        // random possibility of precipitation from 0 to 100 (%)
        precipitation: Math.floor(Math.random() * 101),
        cityId
    }
};

const forecastWeather = async () => {
    const cities = await City.findAll({
        // attributes: ['countryId']
    });
    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const lat = city.latitude;
        const long = city.longitude;
        const timezone = tzlookup(lat, long);
        const currentTime = DateTime.local().setZone(timezone);

        const startTime = currentTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });



        // console.log(currentTime.toISO());
        // console.log(currentTime.hour)
        // console.log(startTime.toISO())




        const count = (await Weather.findAll({
            where: {
                cityId: city.id,
                dt: {
                    [Op.gte]: new Date(startTime.toISO())
                }
            }
        })).length;

        for (let j = count; j < 10; j++) {
            const dt = new Date(startTime.plus({ days: j }).toISO());
            await Weather.create(generateRandomWeather(dt, city.id));
        }

    }
}

forecastWeather();


// cron.schedule('30 0-23 * * *', () => {
//     console.log('running');
// })





// app.listen(port, () => {
//     console.log(`Listening on port ${port}...`);
// });