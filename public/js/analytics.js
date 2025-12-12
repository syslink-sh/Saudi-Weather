// Vercel Web Analytics Integration
// This module initializes Web Analytics on the client side

// Initialize Vercel Web Analytics
// The inject() function enables analytics tracking on the client side
async function initializeAnalytics() {
    try {
        // Dynamically import the @vercel/analytics module
        const { inject } = await import('https://cdn.vercel.com/analytics/script.js');
        
        // Call inject() to initialize analytics
        // This must run on the client side and will track page views and interactions
        inject();
        
        console.log('🌦️ Vercel Web Analytics initialized');
    } catch (error) {
        console.warn('🌦️ Failed to initialize Vercel Web Analytics:', error);
        // Analytics initialization failure should not break the app
    }
}

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    initializeAnalytics();
}

export { initializeAnalytics };
