module.exports = {
    formatHydrometriesLocalPayload,
    formatHydrometriesResourcesPayload,
};

function formatHydrometriesLocalPayload(options) {
    return {
        inside_temperature: options.temperature,
        inside_humidity: options.humidity,
    };
}

function formatHydrometriesResourcesPayload(options) {
    return {
        weather: options.weather || [],
        outside_temperature: options.temp,
        outside_humidity: options.humidity,
        sunrise: options.sunrise,
        sunset: options.sunset,
    };
}
