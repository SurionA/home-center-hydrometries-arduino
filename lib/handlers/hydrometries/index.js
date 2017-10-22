const SerialPort = require('serialport');

const CONSTANTS = require('../../constants');
const { HClogger, HCalert: alert } = require('home-center-core');

const logger = HClogger(CONSTANTS.loggerLabelMain);
const resources = require('../resources');
const utils = require('../../utils');

module.exports = {
    get,
    save,
};

function get(resource, callback) {
    const getExternalResources = resources[resource.name].getHydrometries(resource);

    logger.log('info', 'GET resources from', resource);
    if (!callback) {
        return getExternalResources;
    }

    return getExternalResources
        .then(externalResources => callback(externalResources));
}

function save(resource, callback) {
    logger.log('info', 'SAVE with resources', resource);
    return get(resource).then(externalResources => readData()
        .then(localResources => Object.assign(
            { room: process.env.HYDROMETRIES_ROOM_ID },
            localResources,
            externalResources,
        ))
        .then((payload) => {
            logger.log('info', 'SAVE with payload', payload);

            return resources.home.setHydrometries(payload);
        })
        .then(response => handleResponse(response, callback)))
        .catch(err => handleResponse(err, callback));
}

function readData() {
    const Readline = SerialPort.parsers.Readline;
    const port = new SerialPort(process.env.USB_SERIAL, {
        baudRate: parseInt(process.env.BAURATE, 10),
    });
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

    return new Promise((resolve, reject) => {
        port.on('data', (hydrometries) => {
            const readableHydrometries = parser.read(hydrometries);
            try {
                if (readableHydrometries && JSON.parse(readableHydrometries)) {
                    port.close();

                    const localResources = JSON.parse(readableHydrometries);

                    logger.log('info', 'GET local resources', localResources);
                    resolve(utils.formatHydrometriesLocalPayload(localResources));
                }
            } catch (err) {
                logger.log('error', 'Fail to read local resources from listener ondata', err);
            }
        });

        port.on('error', (error) => {
            logger.log('error', 'READDATA local resources', error.message);
            reject(error.message);
        });
    });
}

function handleResponse(response, callback) {
    if (!callback) {
        return response.data;
    }

    return callback(response.data);
}
