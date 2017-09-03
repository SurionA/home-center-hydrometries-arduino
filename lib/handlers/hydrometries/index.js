const SerialPort = require('serialport');
const winston = require('winston');
const resources = require('../resources');
const utils = require('../../utils');

module.exports = {
    get,
    save,
};

function get(resource, callback) {
    const getExternalResources = resources[resource.name].getHydrometries(resource);

    winston.log('info', 'Home-center hydrometries GET resources from', resource);
    if (!callback) {
        return getExternalResources;
    }

    return getExternalResources
        .then(externalResources => callback(externalResources));
}

function save(resource, callback) {
    winston.log('info', 'Home-center hydrometries SAVE resources from', resource);
    return get(resource).then(externalResources => readData()
        .then(localResources => Object.assign(
            { room: process.env.HYDRMETRIES_ROOM_ID },
            localResources,
            externalResources,
        ))
        .then((payload) => {
            winston.log('info', 'Home-center hydrometries SAVE payload', payload);

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

                    winston.log('info', 'Home-center hydrometries SAVE local resources', localResources);
                    resolve(utils.formatHydrometriesLocalPayload(localResources));
                }
            } catch (err) {
                winston.log('error', 'fail read data', err);
            }
        });

        port.on('error', (error) => {
            winston.log('error', 'Home-center hydrometries READDATA local resources', error.message);
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
