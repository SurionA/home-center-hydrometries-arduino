const axios = require('axios');
const { HClogger } = require('home-center-core');
const utils = require('../../utils');
const CONSTANTS = require('../../constants');

const logger = HClogger(CONSTANTS.loggerLabelMain);

module.exports = {
    getHydrometries,
};

function getHydrometries(options) {
    return axios
        .get(`${CONSTANTS.resources.previsionmeteo.url}${options.place}`)
        .then(response => {
            const data = {
                weather: [
                    {
                        icon: response.data.current_condition.condition_key,
                        description: response.data.current_condition.condition,
                    },
                ],
                temp: response.data.current_condition.tmp,
                humidity: response.data.current_condition.humidity,
                sunrise: response.data.city_info.sunrise,
                sunset: response.data.city_info.sunset,
            };

            logger.log('info', `Fecth hydrometries from ${CONSTANTS.resources.previsionmeteo.url}`, data);

            return utils.formatHydrometriesResourcesPayload(data);
        })
        .catch(error => {
            logger.log(
                'error',
                `Error while fetching hydrometries from ${CONSTANTS.resources.previsionmeteo.url}`,
                error
            );
        });
}
