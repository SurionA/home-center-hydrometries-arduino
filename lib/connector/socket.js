const handlers = require('../handlers');
const CONSTANTS = require('../constants');
const { HClogger } = require('home-center-core');

const logger = HClogger(CONSTANTS.loggerLabelMain);

module.exports = {
    init,
};

function init(socket) {
    logger.log('info', 'Initialize Socket connector');
    socket.on('connection', client => {
        client.on('homecenter:hydrometries:get', handlers.hydrometries.get);
        client.on('homecenter:hydrometries:save', handlers.hydrometries.save);
    });
}
