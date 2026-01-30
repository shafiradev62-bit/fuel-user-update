#!/bin/bash

echo "🚀 Deploying FuelFriendly with WhatsApp support..."

# Stop existing processes
echo "🛑 Stopping existing processes..."
pm2 stop fuel-server fuel-whatsapp 2>/dev/null || true
pm2 delete fuel-server fuel-whatsapp 2>/dev/null || true

# Start WhatsApp daemon first
echo "📱 Starting WhatsApp daemon..."
pm2 start ecosystem.config.cjs --only fuel-whatsapp

# Wait for WhatsApp to initialize
echo "⏳ Waiting for WhatsApp to initialize..."
sleep 10

# Start main server
echo "🖥️ Starting main server..."
pm2 start ecosystem.config.cjs --only fuel-server

# Show status
echo "✅ Deployment complete!"
pm2 status

echo ""
echo "📋 Useful commands:"
echo "  pm2 logs fuel-whatsapp  # View WhatsApp logs"
echo "  pm2 logs fuel-server    # View server logs"
echo "  pm2 restart fuel-whatsapp  # Restart WhatsApp"
echo "  pm2 restart fuel-server    # Restart server"