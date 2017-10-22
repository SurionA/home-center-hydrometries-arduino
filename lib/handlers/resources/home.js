const axios = require('axios');
const { HClogger } = require('home-center-core');
const CONSTANTS = require('../../constants');

const logger = HClogger(CONSTANTS.loggerLabelMain);

module.exports = {
    getHydrometries,
    setHydrometries,
};

function setHydrometries(params) {
    return axios.post(process.env.HYDROMETRIES_API_URL, params).catch(error => {
        logger.log('error', 'Error while creating hydrometry', params, error);
    });
}

function getHydrometries() {
    return axios
        .get(process.env.HYDROMETRIES_API_URL)
        .then(response => response.data)
        .catch(error => {
            logger.log('error', 'Error while fetching hydrometries', error);
        });
}
