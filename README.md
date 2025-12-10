# Rainy 🌦️

Rainy is a beautiful, fast, and immersive weather application that provides real-time forecast about a city that you choose.

## Features

- **Weather**: Current temperature, conditions, wind, humidity, and more.
- **Radar**: Live precipitation and cloud cover radar map.
- **Forecasts**: 24-hour hourly forecast and 7-day daily forecast.

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   or for development:
   ```bash
   npm run dev
   ```
4. Website will be on `http://localhost:3005`. ( For production website will be on `http://localhost:5150`)

## Configuration

Rainy supports separate hosting for the frontend and backend.

### Frontend Configuration (`public/js/config.js`)

```javascript
const config = {
    // API server URL - update for production
    apiBaseUrl: 'https://api.rainy.syslink.dev/api',
    
    // Default location fallback
    defaultLocation: {
        lat: 40.7128,
        lng: -74.0060,
        city: 'New York',
    },
    
    // Search settings
    searchDebounce: 150,
    
    // Map settings
    map: {
        defaultZoom: 6,
        minZoom: 3,
        maxZoom: 10,
    },
};
```

### Server Configuration (`server/config.js`)

```javascript
module.exports = {
    server: {
        port: 5150,  // Production port
    },
    cors: {
        allowedOrigins: [
            'https://rainy.syslink.dev',
            // Add your frontend domains
        ],
    },
};
```

See [server/README.md](server/README.md) for more server configuration options.