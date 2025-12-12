// Frontend Configuration for Rainy
// All settings are documented for clarity and maintainability
const config = {
    // API Base URL - always relative to current origin
    apiBaseUrl: '/api',

    // Default location (used if geolocation fails)
    defaultLocation: {
        lat: 40.7128,
        lon: -74.0060,
        city: 'New York',
        country: 'United States',
    },

    // Search settings
    searchDebounce: 150, // ms debounce for search input
    searchMinLength: 2,  // minimum characters to trigger search

    // Map settings
    map: {
        defaultZoom: 6,
        minZoom: 3,
        maxZoom: 12,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },

    // UI settings
    ui: {
        loaderTimeout: 500,         // ms for loader fade
        errorToastDuration: 3000,   // ms error toast display
        hoverPopupDelay: 600,       // ms delay for map hover popup
    },
};

// Make config available globally
window.appConfig = config;

// Debug logging in development
if (window.location.hostname === 'localhost') {
    console.log('🌦️ Rainy Config:', config);
}

// Initialize Vercel Speed Insights
// Automatically tracks Web Vitals and performance metrics
// Only runs on the client-side in the browser
if (typeof window !== 'undefined') {
    // Speed Insights script is loaded via the index.html tag
    // The window.va function is already defined in the HTML
    if (typeof window.va === 'function') {
        console.log('🌦️ Vercel Speed Insights initialized');
    }
}
