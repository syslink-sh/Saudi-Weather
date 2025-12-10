// Frontend Configuration
const config = {
    // API Base URL - change this when hosting separately
    apiBaseUrl: window.location.hostname === 'localhost' 
        ? `http://localhost:3005/api`
        : 'https://api.rainy.syslink.dev/api', // Change to your API server URL
    
    // Default location (fallback if geolocation fails)
    defaultLocation: {
        lat: 40.7128,
        lng: -74.0060,
        city: 'New York',
    },

    // Search debounce delay (ms)
    searchDebounce: 150,

    // Map settings
    map: {
        defaultZoom: 6,
        minZoom: 3,
        maxZoom: 10,
    },
};

// Make it available globally
window.appConfig = config;
