# Rainy -- Server

This directory contains the backend code for the Rainy websites.

## Structure

- `server.js`: The main entry point for the Express server.
- `controllers/`: Contains logic for handling API requests (fetching data from Open-Meteo, RainViewer, etc.).
- `routes/`: Defines the API endpoints.

## API Endpoints

- `GET /api/weather?lat={lat}&lon={lon}`: Fetches current weather, forecast, and background info.
- `GET /api/search?q={query}`: Searches for cities.
- `GET /api/reverse-geocode?lat={lat}&lon={lon}`: Gets city name from coordinates.

## Setup

The server requires Node.js. Dependencies are managed in the root `package.json`.

To start the server (from the root directory):
```bash
npm start
```
