# Rainy Server 🌦️

The Express.js backend for Rainy weather application. Serves both the API and static frontend files.

## 📁 Structure

```
server/
├── server.js           # Express app entry point
├── config.js           # Configuration (ports, CORS, API URLs)
├── routes/
│   └── api.js          # API route definitions
└── controllers/
    └── apiController.js # Request handlers & external API calls
```

## 🔧 Configuration

### `config.js`

```javascript
module.exports = {
    server: {
        port: 3005,              // Development port
        env: 'development',
    },
    cors: {
        allowedOrigins: [
            'http://localhost:3005',
            'https://rainy.syslink.dev',
        ],
    },
    apis: {
        openMeteo: 'https://api.open-meteo.com/v1',
        openMeteoGeocoding: 'https://geocoding-api.open-meteo.com/v1',
        rainViewer: 'https://api.rainviewer.com',
        nominatim: 'https://nominatim.openstreetmap.org',
    },
};
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3005` (dev) / `5150` (prod) |
| `NODE_ENV` | `development` or `production` | `development` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | See config.js |

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status, uptime, and environment.

### Weather Data
```
GET /api/weather?lat={latitude}&lon={longitude}
```
Returns current weather, hourly forecast (24h), and daily forecast (7 days).

**Response:**
```json
{
    "name": "Current Location",
    "dt": "2025-12-10T14:00",
    "is_day": 1,
    "timezone": "America/New_York",
    "main": {
        "temp": 5.2,
        "humidity": 65,
        "feels_like": 2.1,
        "pressure": 1013
    },
    "weather": [{ "description": "Partly cloudy", "code": 2 }],
    "wind": { "speed": 12.5, "direction": 270 },
    "visibility": 10000,
    "precipitation": 0,
    "hourly": { ... },
    "daily": { ... }
}
```

### City Search
```
GET /api/search?q={query}
```
Search for cities by name. Returns up to 8 results.

**Response:**
```json
[
    {
        "name": "New York",
        "lat": 40.7128,
        "lon": -74.006,
        "country": "United States",
        "countryCode": "US",
        "region": "New York",
        "population": 8336817
    }
]
```

### Reverse Geocoding
```
GET /api/reverse-geocode?lat={latitude}&lon={longitude}
```
Get location name from coordinates.

**Response:**
```json
{
    "name": "Manhattan",
    "country": "United States",
    "countryCode": "US",
    "displayName": "Manhattan, New York County, New York, United States"
}
```

## 🚀 Running

From the project root:

```bash
# Development (with auto-reload)
npm run dev

# Production
NODE_ENV=production npm start
```

## 🔒 Security

- **Helmet.js** — Sets security headers
- **CORS** — Configurable allowed origins
- **Input Validation** — Validates coordinates and search queries
- **CSP** — Content Security Policy for XSS protection

## 📊 External APIs Used

| API | Purpose | Rate Limits |
|-----|---------|-------------|
| [Open-Meteo](https://open-meteo.com) | Weather data | 10,000/day (free) |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search | 10,000/day (free) |
| [Nominatim](https://nominatim.org) | Reverse geocoding | 1 req/sec |
| [RainViewer](https://www.rainviewer.com/api.html) | Radar tiles | Unlimited |
