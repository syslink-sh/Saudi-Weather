# API Reference

All API endpoints are prefixed with `/api`.

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/weather` | Get weather data |
| GET | `/api/search` | Search locations |
| GET | `/api/reverse-geocode` | Coordinates to location name |

---

## Health Check

Check if the API is running.

```
GET /api/health
```

### Response

```json
{
    "status": "OK",
    "timestamp": "2025-12-11T10:30:00.000Z",
    "uptime": 3600,
    "environment": "development"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Always "OK" if healthy |
| `timestamp` | string | ISO 8601 timestamp |
| `uptime` | number | Server uptime in seconds |
| `environment` | string | Current environment |

---

## Get Weather

Fetch weather data for given coordinates.

```
GET /api/weather?lat={latitude}&lon={longitude}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | number | Yes | Latitude (-90 to 90) |
| `lon` | number | Yes | Longitude (-180 to 180) |

### Example Request

```
GET /api/weather?lat=40.7128&lon=-74.0060
```

### Response

```json
{
    "name": "Current Location",
    "dt": "2025-12-11T10:00",
    "is_day": 1,
    "timezone": "America/New_York",
    "main": {
        "temp": 5.2,
        "humidity": 65,
        "feels_like": 2.1,
        "pressure": 1015
    },
    "weather": [{
        "description": "Partly cloudy",
        "code": 2
    }],
    "wind": {
        "speed": 12.5,
        "direction": 270
    },
    "visibility": 10000,
    "precipitation": 0,
    "hourly": {
        "time": ["2025-12-11T00:00", "..."],
        "temperature_2m": [4.5, "..."],
        "weather_code": [2, "..."],
        "precipitation_probability": [10, "..."]
    },
    "daily": {
        "time": ["2025-12-11", "..."],
        "weather_code": [2, "..."],
        "temperature_2m_max": [8.0, "..."],
        "temperature_2m_min": [2.0, "..."],
        "precipitation_sum": [0, "..."],
        "sunrise": ["2025-12-11T07:05", "..."],
        "sunset": ["2025-12-11T16:30", "..."]
    }
}
```

### Weather Codes

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1 | Mainly clear |
| 2 | Partly cloudy |
| 3 | Overcast |
| 45, 48 | Fog |
| 51, 53, 55 | Drizzle |
| 61, 63, 65 | Rain |
| 66, 67 | Freezing rain |
| 71, 73, 75 | Snow fall |
| 77 | Snow grains |
| 80, 81, 82 | Rain showers |
| 85, 86 | Snow showers |
| 95 | Thunderstorm |
| 96, 99 | Thunderstorm with hail |

### Error Responses

**400 Bad Request** - Missing or invalid coordinates:

```json
{
    "error": "Latitude and longitude are required"
}
```

**504 Gateway Timeout** - Weather service timeout:

```json
{
    "error": "Weather service timeout"
}
```

---

## Search Locations

Search for cities by name.

```
GET /api/search?q={query}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 2 characters) |

### Example Request

```
GET /api/search?q=london
```

### Response

```json
[
    {
        "name": "London",
        "lat": 51.5074,
        "lon": -0.1278,
        "country": "United Kingdom",
        "countryCode": "GB",
        "region": "Greater London",
        "population": 8982000
    },
    {
        "name": "London",
        "lat": 42.9849,
        "lon": -81.2453,
        "country": "Canada",
        "countryCode": "CA",
        "region": "Ontario",
        "population": 383822
    }
]
```

Returns up to 8 results, sorted by relevance.

### Error Responses

**400 Bad Request** - Query too short:

```json
{
    "error": "Search query must be at least 2 characters"
}
```

---

## Reverse Geocode

Convert coordinates to a location name.

```
GET /api/reverse-geocode?lat={latitude}&lon={longitude}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | number | Yes | Latitude (-90 to 90) |
| `lon` | number | Yes | Longitude (-180 to 180) |

### Example Request

```
GET /api/reverse-geocode?lat=51.5074&lon=-0.1278
```

### Response

```json
{
    "name": "London",
    "country": "United Kingdom",
    "countryCode": "GB",
    "displayName": "London, Greater London, England, United Kingdom"
}
```

### Fallback Response

If geocoding fails, returns a fallback:

```json
{
    "name": "Current Location",
    "country": "",
    "countryCode": ""
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
    "error": "Error message",
    "details": {}  // Optional additional info
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 404 | Not Found (unknown endpoint) |
| 500 | Internal Server Error |
| 504 | Gateway Timeout (external API timeout) |

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window

Exceeding the limit returns `429 Too Many Requests`.

---

## Data Sources

| Data | Source | Rate Limit |
|------|--------|------------|
| Weather | [Open-Meteo](https://open-meteo.com/) | 10,000/day |
| Geocoding | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | 10,000/day |
| Reverse Geocoding | [Nominatim](https://nominatim.org/) | 1/second |
| Radar | [RainViewer](https://www.rainviewer.com/) | Unlimited |
