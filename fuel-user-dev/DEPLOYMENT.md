# 🚀 FuelFriendly Auto Deployment Guide

## Setup VPS (One-time)

```bash
# 1. Upload setup script to VPS
scp setup-vps.sh root@your-server:/tmp/

# 2. Run setup on VPS
ssh root@your-server
chmod +x /tmp/setup-vps.sh
/tmp/setup-vps.sh

# 3. Setup webhook (optional)
chmod +x webhook-server.sh
./webhook-server.sh 9000
```

## Manual Deployment

```bash
# On VPS
cd /var/www/fuel-user
./deploy.sh
```

## Auto Deployment Options

### 1. Git Push (GitHub Actions)
```bash
git push origin main  # Auto deploys via GitHub Actions
```

### 2. Webhook Trigger
```bash
curl -X POST http://your-server:9000/deploy
```

### 3. Cron Job (Daily 2 AM)
```bash
# Already configured in setup-vps.sh
0 2 * * * /var/www/fuel-user/deploy.sh
```

## Environment Setup

```bash
# Backend
cp backend/.env.local.template backend/.env.local
# Edit: DATABASE_URL, JWT_SECRET, API keys

# Frontend  
cp frontend/.env.local.template frontend/.env.local
# Edit: VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID
```

## SSL Certificate

```bash
# Auto-configured in setup-vps.sh
# Manual: certbot --nginx -d yourdomain.com
```

## Monitoring

```bash
# Deployment logs
tail -f /var/log/fuel-deploy.log

# Docker status
docker-compose ps

# Service status
systemctl status fuel-webhook
```

## Quick Commands

```bash
# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Update only
git pull && docker-compose up -d --build

# Rollback
docker-compose down && git checkout HEAD~1 && ./deploy.sh
```