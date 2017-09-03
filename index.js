const connector = require('./lib/connector');
const handlers = require('./lib/handlers/hydrometries');

module.exports = {
    get: handlers.get,
    initSocket: connector.socket.init,
    save: handlers.save,
};
