const cron = require('node-cron');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const { sequelize } = require('./db/sequelize-pg');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const { DateTime } = require('luxon');
const tzlookup = require('tz-lookup');

// import models
const { City } = require('./models/city');
const { Weather } = require('./models/weather');

// import utils
const { RoundAtDecimal } = require('./utils/math-utils');

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
    // start a transaction and save it into a variable
    const t = await sequelize.transaction();

    try {
        // find all cities in the db
        const cities = await City.findAll({ transaction: t });

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];
            const { id, latitude, longitude } = city;
            // get the timezone for the current city based on coordinates
            const timezone = tzlookup(latitude, longitude);
            // get the current time for this timezone
            const currentTime = DateTime.local().setZone(timezone);
            // set 00:00 to current day
            const currentDay = currentTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            const count = await Weather.count({
                where: {
                    cityId: id,
                    dt: {
                        [Op.gte]: new Date(currentDay.toISO())
                    }
                }
            }, { transaction: t });

            // update the existing weather records (starting from current day) using random data
            for (let j = 0; j < count; j++) {
                const dt = new Date(currentDay.plus({ days: j }).toISO());
                await Weather.update({ ...generateRandomWeather(dt, id), updatedAt: new Date() }, {
                    where: {
                        dt,
                        cityId: id
                    }
                });
            }

            // add new weather record(s) until the current city has next 10-day weather forecasts in the db
            for (let j = count; j < 10; j++) {
                const dt = new Date(currentDay.plus({ days: j }).toISO());
                await Weather.create(generateRandomWeather(dt, city.id), { transaction: t });
            }
        }
        // commit the transaction if everything goes ok
        await t.commit();
    } catch (error) {
        console.log(error);
        // roll back the transaction if an error was thrown
        await t.rollback();
    }
}

// execute the job first when starting the server
forecastWeather();

// schedule the job every 15 mins
cron.schedule('*/15 * * * *', () => {
    console.log('Updating weathers...');
    forecastWeather();
})

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});