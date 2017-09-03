const axios = require('axios');
const utils = require('../../utils');
const CONSTANTS = require('../../constants');

module.exports = {
    getHydrometries,
};

function getHydrometries(options) {
    const params = Object.assign({}, CONSTANTS.resources.openweathermap.url_params, options);

    return axios.get(CONSTANTS.resources.openweathermap.url, {
        params: {
            appid: process.env.OPENWEATHERMAP_API_KEY,
            id: params.place_id,
            lang: params.lang,
            units: params.units,
        } })
        .then((response) => {
            const data = {
                weather: response.data.weather,
                temp: response.data.main.temp,
                humidity: response.data.main.humidity,
                sunrise: response.data.sys.sunrise,
                sunset: response.data.sys.sunset,
            };

            return utils.formatHydrometriesResourcesPayload(data);
        })
        .catch((error) => {
            console.log(error);
        });
}
