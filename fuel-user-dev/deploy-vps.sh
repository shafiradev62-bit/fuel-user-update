#!/bin/bash

# Script untuk dijalankan di VPS
# Usage: ./deploy-vps.sh

DOCKER_USERNAME="wasilahhadi"
IMAGE_NAME="fuel-user-backend"

echo "🔄 Pulling latest code..."
git pull

echo "🐳 Building Docker image..."
docker build -f Dockerfile.backend -t $DOCKER_USERNAME/$IMAGE_NAME:latest .

echo "📤 Pushing to Docker Hub..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:latest

echo "🚀 Updating deployment..."
kubectl set image deployment/fuel-user fuel-user=$DOCKER_USERNAME/$IMAGE_NAME:latest -n fuel-friend
kubectl rollout status deployment/fuel-user -n fuel-friend

echo "✅ Deployment complete!"
kubectl get pods -n fuel-friend