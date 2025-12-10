module.exports = {
    // Server Configuration
    server: {
        port: process.env.PORT || (process.env.NODE_ENV === 'production' ? 5150 : 3005),
        env: process.env.NODE_ENV || 'development',
    },

    // CORS Configuration
    cors: {
        // Allowed origins for the API
        allowedOrigins: process.env.ALLOWED_ORIGINS 
            ? process.env.ALLOWED_ORIGINS.split(',') 
            : [
                'http://localhost:3005',
                'http://localhost:5150',
                'https://rainy.syslink.dev',
            ],
    },

    // API URLs (for reference)
    apis: {
        openMeteo: 'https://api.open-meteo.com/v1',
        rainViewer: 'https://api.rainviewer.com',
        nominatim: 'https://nominatim.openstreetmap.org',
    },

    // Rate Limiting (optional)
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // limit each IP to 100 requests per windowMs
    },
};
