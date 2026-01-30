#!/bin/bash

# Simple Backend Deploy
set -e

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "🚀 Deploying FuelFriendly Backend..."

# Git pull
log "Updating code..."
git pull origin main

# Install dependencies
log "Installing dependencies..."
cd backend
npm install --production

# Restart backend
log "Restarting backend..."
pkill -f "node.*index-standardized.js" || true
sleep 2

# Start backend
nohup node server/index-standardized.js > ../backend.log 2>&1 &

# Health check
sleep 3
if curl -f -s http://localhost:4000/api/health > /dev/null; then
    log "✅ Backend deployed successfully!"
else
    log "❌ Backend health check failed"
    exit 1
fi

log "🎉 Deployment completed!"