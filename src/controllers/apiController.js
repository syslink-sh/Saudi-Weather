const axios = require('axios');

exports.getHealth = (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
};

// WMO Weather interpretation codes (WW)
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

        // Using Open-Meteo API (No API Key required)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

        const response = await axios.get(url);
        const data = response.data;
        const current = data.current;

        // Map Open-Meteo response to match the structure expected by the frontend
        // Frontend expects:
        // data.main.temp
        // data.weather[0].description
        // data.main.humidity
        // data.wind.speed
        // data.name

        const weatherDescription = weatherCodes[current.weather_code] || 'Unknown';

        const mappedData = {
            name: "Current Location", // Open-Meteo doesn't provide city name in this endpoint
            main: {
                temp: current.temperature_2m,
                humidity: current.relative_humidity_2m
            },
            weather: [
                {
                    description: weatherDescription
                }
            ],
            wind: {
                speed: current.wind_speed_10m
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
