# Architecture

This document describes the project structure and design decisions.

## Project Structure

```
rainy/
├── public/                    # Frontend (served statically)
│   ├── index.html             # Main HTML file
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   ├── css/
│   │   └── style.css          # Styles with weather themes
│   ├── js/
│   │   ├── config.js          # Frontend configuration
│   │   └── main.js            # Application logic
│   └── icons/                 # PWA icons (72x72 to 512x512)
│
├── server/                    # Backend (Node.js/Express)
│   ├── server.js              # Express app entry point
│   ├── config.js              # Server configuration
│   ├── routes/
│   │   └── api.js             # API route definitions
│   └── controllers/
│       └── apiController.js   # API business logic
│
├── docs/                      # Documentation
├── ghimages/                  # GitHub README images
├── package.json               # Dependencies and scripts
└── README.md                  # Project readme
```

## Backend Architecture

### Express Server (`server/server.js`)

The main entry point that:

1. Configures security middleware (Helmet, CORS)
2. Sets up request logging (Morgan)
3. Mounts API routes at `/api`
4. Serves static files from `public/`
5. Handles SPA fallback (all routes serve `index.html`)

### Routes (`server/routes/api.js`)

Defines API endpoints:

- `GET /api/health` → Health check
- `GET /api/weather` → Weather data
- `GET /api/search` → Location search
- `GET /api/reverse-geocode` → Coordinates to name

### Controllers (`server/controllers/apiController.js`)

Contains business logic for each endpoint:

- Input validation
- External API calls (Open-Meteo, Nominatim)
- Response transformation
- Error handling

### Data Flow

```
Browser Request
      ↓
Express Server
      ↓
Route Handler
      ↓
Controller
      ↓
External API (Open-Meteo/Nominatim)
      ↓
Transform Response
      ↓
JSON Response
```

## Frontend Architecture

### Single Page Application

The frontend is a vanilla JavaScript SPA with no build step required.

### Entry Point (`public/index.html`)

- Loads stylesheets and scripts
- Contains all HTML structure
- Registers the Service Worker

### Configuration (`public/js/config.js`)

- Exports settings to `window.appConfig`
- No environment variables needed
- Auto-detects API base URL

### Main Application (`public/js/main.js`)

Handles:

- DOM manipulation
- API calls via `fetch()`
- Geolocation
- Search with debouncing
- Map initialization (Leaflet)
- Weather icon rendering (SVG)
- Background animations

### Styling (`public/css/style.css`)

Features:

- CSS custom properties for theming
- Weather-based background animations
- Responsive breakpoints
- PWA safe area support

## External APIs

### Open-Meteo (Weather)

```
GET https://api.open-meteo.com/v1/forecast
```

- Free, no API key required
- Returns current + hourly + daily forecast
- Automatic timezone detection

### Open-Meteo Geocoding (Search)

```
GET https://geocoding-api.open-meteo.com/v1/search
```

- City name search with autocomplete
- Returns coordinates and metadata

### Nominatim (Reverse Geocoding)

```
GET https://nominatim.openstreetmap.org/reverse
```

- Converts coordinates to city name
- Used for geolocation display

### RainViewer (Radar)

```
GET https://api.rainviewer.com/public/weather-maps.json
```

- Precipitation radar tiles
- Satellite cloud imagery
- Real-time updates

## Security

### Helmet

Configures security headers:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options

### CORS

- Whitelist-based origin checking
- Credentials support
- Limited methods (GET, POST, OPTIONS)

### Input Validation

- Coordinate range checking
- Query length validation
- Type coercion

## Performance

### Static File Caching

- 1-day cache in production
- ETag support

### Service Worker

- Caches static assets
- Network-only for API (fresh weather data)
- Offline fallback page

### Efficient Updates

- Debounced search input
- Lazy map loading
- SVG weather icons (no image requests)

## Design Decisions

### No Build Step

The frontend uses vanilla JavaScript without bundling. Benefits:

- Simpler development setup
- No transpilation needed
- Direct browser debugging

### No API Keys

Using Open-Meteo eliminates API key management:

- No `.env` file needed
- Simpler deployment
- No key rotation

### Config Files Over Environment Variables

JavaScript config files are preferred because:

- Type safety
- IDE autocomplete
- Easy documentation
- Version controllable

Environment variables are still supported for cloud platforms.
