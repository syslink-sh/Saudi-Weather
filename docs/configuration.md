# Configuration

Rainy uses JavaScript configuration files for both server and frontend settings. No `.env` file is required.

## Server Configuration

**File**: `server/config.js`

### Server Settings

```javascript
server: {
    port: 3005,        // Development port (5150 in production)
    env: 'development', // 'development' or 'production'
    isProduction: false
}
```

| Setting | Description | Default |
|---------|-------------|---------|
| `port` | HTTP server port | `3005` (dev) / `5150` (prod) |
| `env` | Environment name | `development` |
| `isProduction` | Boolean flag | Auto-detected |

### CORS Settings

```javascript
cors: {
    allowedOrigins: [
        'http://localhost:3005',
        'http://localhost:5150',
        'http://127.0.0.1:3005',
        'http://127.0.0.1:5150',
        'https://rainy.syslink.dev'
    ]
}
```

Add your domain to `allowedOrigins` for production deployments.

### External APIs

```javascript
apis: {
    openMeteo: 'https://api.open-meteo.com/v1',
    openMeteoGeocoding: 'https://geocoding-api.open-meteo.com/v1',
    rainViewer: 'https://api.rainviewer.com',
    nominatim: 'https://nominatim.openstreetmap.org'
}
```

All APIs are free and require no authentication.

### Rate Limiting

```javascript
rateLimit: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 100            // Max requests per window
}
```

### Cache Settings

```javascript
cache: {
    weather: 300,    // 5 minutes
    search: 3600,    // 1 hour
    geocode: 86400   // 24 hours
}
```

Cache durations are in seconds.

## Frontend Configuration

**File**: `public/js/config.js`

### API Settings

```javascript
apiBaseUrl: '/api'  // Relative to current origin
```

### Default Location

Fallback location when geolocation is denied or fails:

```javascript
defaultLocation: {
    lat: 40.7128,
    lon: -74.0060,
    city: 'New York',
    country: 'United States'
}
```

### Search Settings

```javascript
searchDebounce: 150,    // Milliseconds to wait before searching
searchMinLength: 2      // Minimum characters to trigger search
```

### Map Settings

```javascript
map: {
    defaultZoom: 6,
    minZoom: 3,
    maxZoom: 12,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}
```

### UI Settings

```javascript
ui: {
    loaderTimeout: 500,       // Loading spinner delay (ms)
    errorToastDuration: 3000, // Error message display time (ms)
    hoverPopupDelay: 600      // Map hover popup delay (ms)
}
```

## Environment Variables

While config files are the primary configuration method, these environment variables are supported:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Set environment | `production` |
| `PORT` | Override server port | `8080` |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `https://example.com,https://app.example.com` |

| `DEBUG` | Enable verbose debug logging on server | `true` or `false` |

Example:

```bash
NODE_ENV=production PORT=8080 npm start
```

## Customizing for Your Deployment

### Change Default Location

Edit `public/js/config.js`:

```javascript
defaultLocation: {
    lat: 51.5074,    // London
    lon: -0.1278,
    city: 'London',
    country: 'United Kingdom'
}
```

### Add Your Domain

Edit `server/config.js`:

```javascript
cors: {
    allowedOrigins: [
        // ... existing origins
        'https://your-domain.com'
    ]
}
```

### Change Default Port

Edit `server/config.js`:

```javascript
server: {
    port: parseInt(process.env.PORT, 10) || 8080,
    // ...
}
```
