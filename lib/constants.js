module.exports = {
    loggerLabelMain: 'HomeCenter Hydrometry Arduino',
    resources: {
        openweathermap: {
            url: 'http://api.openweathermap.org/data/2.5/weather/',
            url_params: {
                units: 'metric',
                lang: 'fr',
            },
        },
        previsionmeteo: {
            url: 'http://www.prevision-meteo.ch/services/json/',
        },
    },
};
