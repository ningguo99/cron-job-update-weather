const { DateTime } = require('luxon');

module.exports.DataTypeNoTz = (date) => {
    const dt = DateTime.fromJSDate(date, { zone: 'utc' });
    const resDt = dt.plus({ minutes: DateTime.now().offset });
    return new Date(resDt.toISO());
};