# Rainy 🌦️

A beautiful, fast, and immersive weather application that provides real-time forecasts for any city in the world.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## ✨ Features

- **Real-time Weather** — Current temperature, conditions, wind, humidity, pressure, and visibility
- **Live Radar** — Interactive precipitation and cloud cover radar map powered by RainViewer
- **Forecasts** — 24-hour hourly forecast and 7-day daily forecast
- **Dynamic Backgrounds** — Beautiful animated backgrounds that change based on weather and time of day
- **City Search** — Search any city worldwide with autocomplete
- **Geolocation** — Automatically detects your location on load
- **Responsive** — Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/syslink-sh/rainy.git
cd rainy

# Install dependencies
npm install

# Start the server
npm start
```

The app will be available at `http://localhost:3005`

### Development Mode

```bash
npm run dev
```

Uses nodemon for auto-reload on file changes.

## 📁 Project Structure

```
rainy/
├── public/                 # Frontend static files
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── style.css       # Styles with dynamic weather themes
│   └── js/
│       ├── config.js       # Frontend configuration
│       └── main.js         # Main application logic
├── server/                 # Backend API server
│   ├── server.js           # Express server entry point
│   ├── config.js           # Server configuration
│   ├── routes/
│   │   └── api.js          # API route definitions
│   └── controllers/
│       └── apiController.js # API logic & external API calls
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3005` (dev) / `5150` (prod) |
| `NODE_ENV` | Environment | `development` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | localhost, rainy.syslink.dev |

### Server Config (`server/config.js`)

```javascript
module.exports = {
    server: {
        port: 3005,
        env: 'development',
    },
    cors: {
        allowedOrigins: ['http://localhost:3005', 'https://rainy.syslink.dev'],
    },
};
```

### Frontend Config (`public/js/config.js`)

The frontend auto-detects the API URL based on the current hostname.

## 🌐 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check with uptime and status |
| `GET /api/weather?lat=&lon=` | Get weather data for coordinates |
| `GET /api/search?q=` | Search cities by name |
| `GET /api/reverse-geocode?lat=&lon=` | Get city name from coordinates |

## 🚢 Deployment

### Render

1. Connect your GitHub repository
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `npm start`
4. Add environment variable: `NODE_ENV=production`

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5150
ENV NODE_ENV=production
CMD ["npm", "start"]
```

### Manual

```bash
NODE_ENV=production npm start
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, CSS3
- **APIs**: Open-Meteo (weather), RainViewer (radar), Nominatim (geocoding)
- **Map**: Leaflet.js

## 📄 License

ISC © [SySLink](https://github.com/syslink-sh)

## 🔗 Links

- [Live Demo](https://rainy.syslink.dev)
- [GitHub](https://github.com/syslink-sh/rainy)
- [Report Issues](https://github.com/syslink-sh/rainy/issues)