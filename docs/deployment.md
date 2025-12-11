# Deployment

This guide covers deploying Rainy to various platforms.

## Quick Deploy

### Render

1. Connect your GitHub repository at [render.com](https://render.com)
2. Create a new **Web Service**
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `NODE_ENV=production`

### Railway

1. Connect GitHub at [railway.app](https://railway.app)
2. Create new project from repo
3. Railway auto-detects Node.js

### Vercel

1. Import project at [vercel.com](https://vercel.com)
2. Configure:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: `public`
   - **Install Command**: `npm install`

Note: For Vercel, you may need to configure serverless functions for the API.

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# Set environment
heroku config:set NODE_ENV=production
```

## Manual Deployment

### Using PM2

Install PM2 globally:

```bash
npm install -g pm2
```

Start the application:

```bash
cd /path/to/rainy
npm install --production
pm2 start server/server.js --name rainy
```

PM2 commands:

```bash
pm2 status          # Check status
pm2 logs rainy      # View logs
pm2 restart rainy   # Restart
pm2 stop rainy      # Stop
pm2 save            # Save process list
pm2 startup         # Auto-start on boot
```

### Using systemd

Create service file `/etc/systemd/system/rainy.service`:

```ini
[Unit]
Description=Rainy Weather App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/rainy
ExecStart=/usr/bin/node server/server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=5150

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable rainy
sudo systemctl start rainy
sudo systemctl status rainy
```

## Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 5150

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["node", "server/server.js"]
```

### Build and Run

```bash
# Build image
docker build -t rainy .

# Run container
docker run -d -p 5150:5150 --name rainy rainy

# View logs
docker logs -f rainy
```

### Docker Compose

```yaml
version: '3.8'

services:
  rainy:
    build: .
    ports:
      - "5150:5150"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run:

```bash
docker-compose up -d
```

## Reverse Proxy

### Nginx

```nginx
server {
    listen 80;
    server_name rainy.example.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rainy.example.com;

    ssl_certificate /etc/letsencrypt/live/rainy.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rainy.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5150;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Caddy

```
rainy.example.com {
    reverse_proxy localhost:5150
}
```

## SSL/HTTPS

### Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d rainy.example.com

# Auto-renewal is set up automatically
```

### Cloudflare

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Enable **Full (strict)** SSL mode
4. Cloudflare handles SSL automatically

## Environment Configuration

### Production Settings

Add your domain to CORS in `server/config.js`:

```javascript
cors: {
    allowedOrigins: [
        // ... existing
        'https://rainy.yourdomain.com'
    ]
}
```

Or use environment variable:

```bash
ALLOWED_ORIGINS=https://rainy.yourdomain.com,https://www.yourdomain.com
```

### Port Configuration

Default ports:
- Development: `3005`
- Production: `5150`

Override with `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Health Checks

Use the health endpoint for monitoring:

```bash
curl https://rainy.example.com/api/health
```

Expected response:

```json
{
    "status": "OK",
    "timestamp": "2025-12-11T10:30:00.000Z",
    "uptime": 3600,
    "environment": "production"
}
```

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
```

### Log Aggregation

In production, logs are in `combined` format. Pipe to your logging service:

```bash
pm2 start server/server.js --log /var/log/rainy/app.log
```

## Performance Checklist

- [ ] `NODE_ENV=production` is set
- [ ] Using process manager (PM2/systemd)
- [ ] HTTPS enabled
- [ ] Reverse proxy configured
- [ ] Static file caching enabled
- [ ] Health check endpoint monitored
