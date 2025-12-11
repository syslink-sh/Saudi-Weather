# Getting Started

This guide will help you get Rainy up and running on your local machine.

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** (comes with Node.js)

Verify your installation:

```bash
node --version  # Should be v18.0.0 or higher
npm --version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/syslink-sh/rainy.git
cd rainy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

### 4. Open in Browser

Navigate to [http://localhost:3005](http://localhost:3005)

## What Happens on Startup

1. The Express server starts on the configured port (default: 3005)
2. Static files from `public/` are served
3. API routes are mounted at `/api`
4. The app attempts to detect your location via browser geolocation
5. Weather data is fetched and displayed

## Allowing Location Access

For the best experience, allow location access when prompted. This enables:

- Automatic weather for your current location
- Accurate local time display

If you deny location access, the app defaults to New York, NY.

## Next Steps

- [Configure the application](./configuration.md)
- [Explore the API](./api-reference.md)
- [Deploy to production](./deployment.md)
