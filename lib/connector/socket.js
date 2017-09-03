module.exports = {
    init,
};

const handler = require('../handler');

function init(socket) {
    socket.on('connection', (client) => {
        client.on('homecenter:hydrometries:get', handler.hydrometries.get);
        client.on('homecenter:hydrometries:save', handler.hydrometries.save);
    });
}
