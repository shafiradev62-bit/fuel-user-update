#!/bin/bash

echo "🚀 Building FuelFriendly iOS App..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build

# Sync to iOS
echo "📱 Syncing to iOS..."
npx cap sync ios

echo "✅ Build completed! Opening Xcode..."
npx cap open ios

echo "📋 Next steps in Xcode:"
echo "1. Set Bundle Identifier"
echo "2. Configure Team & Signing"
echo "3. Product → Archive"
echo "4. Distribute App → Export IPA"