module.exports = {
    init,
};

const handlers = require('../handlers');

function init(socket) {
    socket.on('connection', (client) => {
        client.on('homecenter:hydrometries:get', handlers.hydrometries.get);
        client.on('homecenter:hydrometries:save', handlers.hydrometries.save);
    });
}
