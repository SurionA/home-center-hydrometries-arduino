const connector = require('./lib/connector');

module.exports = {
    initSocket: connector.socket.init,
};
