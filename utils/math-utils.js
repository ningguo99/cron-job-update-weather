module.exports.RoundAtDecimal = (num, place) => {
    // console.log(Math.round((num + Number.EPSILON) * Math.pow(10, place)))
    return Math.round((num + Number.EPSILON) * Math.pow(10, place)) / Math.pow(10, place);
};