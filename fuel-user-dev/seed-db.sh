#!/bin/bash

echo "🌱 Running database seed..."

# Get pod name
POD_NAME=$(kubectl get pods -n fuel-friend -l app=fuel-user -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ No fuel-user pod found!"
    exit 1
fi

echo "📦 Pod found: $POD_NAME"

# Run seed command
echo "🌱 Running seed..."
kubectl exec -n fuel-friend $POD_NAME -- npm run seed

echo "✅ Database seeded successfully!"