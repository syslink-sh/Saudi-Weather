const axios = require('axios');

exports.getHealth = (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
};

const weatherCodes = {
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
    99: 'Thunderstorm with heavy hail'
};

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,pressure_msl,visibility,precipitation,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

        const response = await axios.get(url);
        const data = response.data;
        const current = data.current;
        const hourly = data.hourly;
        const daily = data.daily;

        const weatherDescription = weatherCodes[current.weather_code] || 'Unknown';

        const mappedData = {
            name: "Current Location", 
            dt: current.time,
            is_day: current.is_day,
            timezone: data.timezone,
            main: {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                feels_like: current.apparent_temperature,
                pressure: current.pressure_msl
            },
            weather: [
                {
                    description: weatherDescription,
                    code: current.weather_code
                }
            ],
            wind: {
                speed: current.wind_speed_10m
            },
            visibility: current.visibility,
            precipitation: current.precipitation,
            hourly: {
                time: hourly.time.slice(0, 24), // Next 24 hours
                temperature_2m: hourly.temperature_2m.slice(0, 24),
                weather_code: hourly.weather_code.slice(0, 24)
            },
            daily: {
                time: daily.time.slice(0, 7), // Next 7 days
                weather_code: daily.weather_code.slice(0, 7),
                temperature_2m_max: daily.temperature_2m_max.slice(0, 7),
                temperature_2m_min: daily.temperature_2m_min.slice(0, 7)
            }
        };

        res.json(mappedData);

    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    }
};

exports.searchLocation = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
        
        const response = await axios.get(url);
        const data = response.data;

        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const locations = data.results.map(loc => ({
            name: loc.name,
            lat: loc.latitude,
            lon: loc.longitude,
            country: loc.country,
            region: loc.admin1 || ''
        }));

        res.json(locations);

    } catch (error) {
        console.error('Error searching location:', error.message);
        res.status(500).json({ error: 'Failed to search location' });
    }
};

exports.getReverseGeocode = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'RainyWeatherApp/1.0' 
            }
        });

        const data = response.data;
        const address = data.address || {};
        
        const city = address.city || 
                    address.town || 
                    address.village || 
                    address.municipality ||
                    address.suburb ||
                    'Current Location';
        
        const country = address.country || '';

        res.json({ name: city, country: country });

    } catch (error) {
        console.error('Error in reverse geocoding:', error.message);
        res.json({ name: 'Current Location' });
    }
};
