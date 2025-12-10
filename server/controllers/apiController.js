const axios = require('axios');
const config = require('../config');

// Weather code descriptions
const WEATHER_CODES = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};

// Axios instance with defaults
const http = axios.create({
    timeout: 10000,
    headers: {
        'User-Agent': 'RainyWeatherApp/1.0 (https://rainy.syslink.dev)',
    },
});

/**
 * Health check endpoint
 */
exports.getHealth = (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        environment: config.server.env,
    });
};

/**
 * Validate latitude and longitude
 */
const validateCoordinates = (lat, lon) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
        return { valid: false, error: 'Invalid coordinates' };
    }
    if (latitude < -90 || latitude > 90) {
        return { valid: false, error: 'Latitude must be between -90 and 90' };
    }
    if (longitude < -180 || longitude > 180) {
        return { valid: false, error: 'Longitude must be between -180 and 180' };
    }

    return { valid: true, latitude, longitude };
};

/**
 * Get weather data for coordinates
 */
exports.getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const coords = validateCoordinates(lat, lon);
        if (!coords.valid) {
            return res.status(400).json({ error: coords.error });
        }

        const url = `${config.apis.openMeteo}/forecast`;
        const params = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature,pressure_msl,visibility,precipitation,is_day',
            hourly: 'temperature_2m,weather_code,precipitation_probability',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
            timezone: 'auto',
            forecast_days: 7,
        };

        const response = await http.get(url, { params });
        const data = response.data;
        const current = data.current;
        const hourly = data.hourly;
        const daily = data.daily;

        const weatherDescription = WEATHER_CODES[current.weather_code] || 'Unknown';

        const mappedData = {
            name: 'Current Location',
            dt: current.time,
            is_day: current.is_day,
            timezone: data.timezone,
            main: {
                temp: Math.round(current.temperature_2m * 10) / 10,
                humidity: current.relative_humidity_2m,
                feels_like: Math.round(current.apparent_temperature * 10) / 10,
                pressure: Math.round(current.pressure_msl),
            },
            weather: [{
                description: weatherDescription,
                code: current.weather_code,
            }],
            wind: {
                speed: Math.round(current.wind_speed_10m * 10) / 10,
                direction: current.wind_direction_10m,
            },
            visibility: current.visibility,
            precipitation: current.precipitation,
            hourly: {
                time: hourly.time.slice(0, 24),
                temperature_2m: hourly.temperature_2m.slice(0, 24),
                weather_code: hourly.weather_code.slice(0, 24),
                precipitation_probability: hourly.precipitation_probability?.slice(0, 24) || [],
            },
            daily: {
                time: daily.time,
                weather_code: daily.weather_code,
                temperature_2m_max: daily.temperature_2m_max,
                temperature_2m_min: daily.temperature_2m_min,
                precipitation_sum: daily.precipitation_sum,
                sunrise: daily.sunrise,
                sunset: daily.sunset,
            },
        };

        res.json(mappedData);

    } catch (error) {
        console.error('[Weather Error]', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                error: 'Weather service error',
                details: error.response.data,
            });
        }

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({ error: 'Weather service timeout' });
        }

        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
};

/**
 * Search for locations by name
 */
exports.searchLocation = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({ error: 'Search query must be at least 2 characters' });
        }

        const url = `${config.apis.openMeteoGeocoding}/search`;
        const params = {
            name: q.trim(),
            count: 8,
            language: 'en',
            format: 'json',
        };

        const response = await http.get(url, { params });
        const data = response.data;

        if (!data.results || data.results.length === 0) {
            return res.json([]);
        }

        const locations = data.results.map(loc => ({
            name: loc.name,
            lat: loc.latitude,
            lon: loc.longitude,
            country: loc.country || '',
            countryCode: loc.country_code || '',
            region: loc.admin1 || '',
            population: loc.population || 0,
        }));

        res.json(locations);

    } catch (error) {
        console.error('[Search Error]', error.message);
        res.status(500).json({ error: 'Failed to search locations' });
    }
};

/**
 * Reverse geocode coordinates to location name
 */
exports.getReverseGeocode = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const coords = validateCoordinates(lat, lon);
        if (!coords.valid) {
            return res.status(400).json({ error: coords.error });
        }

        const url = `${config.apis.nominatim}/reverse`;
        const params = {
            format: 'json',
            lat: coords.latitude,
            lon: coords.longitude,
            zoom: 10,
            addressdetails: 1,
        };

        const response = await http.get(url, { params });
        const data = response.data;
        const address = data.address || {};

        const city = address.city
            || address.town
            || address.village
            || address.municipality
            || address.county
            || address.suburb
            || 'Unknown Location';

        const country = address.country || '';
        const countryCode = address.country_code?.toUpperCase() || '';

        res.json({
            name: city,
            country,
            countryCode,
            displayName: data.display_name || city,
        });

    } catch (error) {
        console.error('[Geocode Error]', error.message);
        // Return fallback instead of error for better UX
        res.json({ name: 'Current Location', country: '', countryCode: '' });
    }
};
