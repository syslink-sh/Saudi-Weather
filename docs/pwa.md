# PWA Features

Rainy is a Progressive Web App (PWA) that can be installed on phones, tablets, and computers.

## What is a PWA?

A PWA is a web application that provides an app-like experience:

- **Installable** - Add to home screen or app launcher
- **Offline Support** - Works without internet (cached assets)
- **Fast** - Loads quickly from cache
- **Responsive** - Adapts to any screen size

## Installation

### iOS (Safari)

1. Open [rainy.syslink.dev](https://rainy.syslink.dev)
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

### Android (Chrome)

1. Open [rainy.syslink.dev](https://rainy.syslink.dev)
2. Tap the **menu** (three dots)
3. Tap **Add to Home Screen** or **Install app**
4. Tap **Install**

### Desktop (Chrome/Edge)

1. Open [rainy.syslink.dev](https://rainy.syslink.dev)
2. Look for the **install icon** in the address bar
3. Click **Install**

Or:

1. Click the **menu** (three dots)
2. Click **Install Rainy...**

## Technical Implementation

### Web App Manifest

**File**: `public/manifest.json`

```json
{
    "name": "Rainy - Weather App",
    "short_name": "Rainy",
    "description": "Real-time weather forecasts",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#4facfe",
    "theme_color": "#4facfe",
    "icons": [...]
}
```

### Service Worker

**File**: `public/sw.js`

The Service Worker handles:

#### Caching Strategy

| Resource | Strategy | Cached? |
|----------|----------|---------|
| HTML, CSS, JS | Cache-first | ✅ Yes |
| Icons, fonts | Cache-first | ✅ Yes |
| CDN resources | Cache-first | ✅ Yes |
| API calls | Network-only | ❌ No |

Weather data is **never cached** to ensure users always see current conditions.

#### Cached Assets

```javascript
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/config.js',
    '/js/main.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // CDN resources...
];
```

#### Offline Behavior

When offline:

- Cached pages and assets load normally
- Weather API calls return an error message
- Users see "Weather data unavailable offline"

### Meta Tags

```html
<!-- PWA Meta Tags -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Rainy">
<meta name="theme-color" content="#4facfe">
```

### Icons

Required icon sizes:

| Size | Purpose |
|------|---------|
| 72x72 | Android legacy |
| 96x96 | Android legacy |
| 128x128 | Chrome Web Store |
| 144x144 | Windows tiles |
| 152x152 | iOS |
| 192x192 | Android, Chrome |
| 384x384 | Android splash |
| 512x512 | Android, maskable |

Icons are located in `public/icons/`.

## Mobile Optimizations

### Safe Area Support

Handles notched devices (iPhone X+):

```css
@supports (padding: env(safe-area-inset-top)) {
    .app-container {
        padding-top: calc(2rem + env(safe-area-inset-top));
        padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    }
}
```

### Touch-Friendly

- Minimum tap target: 44px
- Input font size: 16px (prevents iOS zoom)
- Touch scrolling enabled

### Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| 1024px | Large tablets |
| 768px | Tablets |
| 480px | Phones |
| 360px | Small phones |

### Landscape Mode

Special layout for mobile landscape orientation.

## Standalone Mode Detection

Detect if running as installed PWA:

```css
@media (display-mode: standalone) {
    /* PWA-specific styles */
}
```

```javascript
if (window.matchMedia('(display-mode: standalone)').matches) {
    // Running as installed app
}
```

## Updating the PWA

When you deploy updates:

1. Service Worker detects new version
2. New assets are downloaded in background
3. Console logs: "New version available! Refresh to update."
4. User refreshes to get new version

### Forcing Update

To force users to get updates, increment the cache version:

```javascript
// In sw.js
const STATIC_CACHE = 'rainy-static-v2';  // Bump version
```
