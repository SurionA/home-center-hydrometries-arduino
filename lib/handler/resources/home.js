const axios = require('axios');

module.exports = {
    getHydrometries,
    setHydrometries,
};

function setHydrometries(params) {
    return axios.post(process.env.HYDRMETRIES_API_URL, params)
        .catch((error) => {
            console.log(error);
        });
}

function getHydrometries() {
    return axios.get(process.env.HYDRMETRIES_API_URL)
        .then(response => response.data)
        .catch((error) => {
            console.log(error);
        });
}
