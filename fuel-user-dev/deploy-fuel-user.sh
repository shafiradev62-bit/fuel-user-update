#!/bin/bash

echo "📦 Creating ConfigMap from backend code..."

# Create namespace
kubectl apply -f fuel-user-secret.yaml

# Create ConfigMap from backend directory
kubectl create configmap fuel-user-code \
  --from-file=backend/ \
  --namespace=fuel-friend \
  --dry-run=client -o yaml | kubectl apply -f -

# Deploy application
kubectl apply -f fuel-user-deploy.yaml

echo "✅ Fuel-user backend deployed!"
echo "🌐 API akan tersedia di: http://api.72.61.69.116.nip.io"

# Show status
kubectl get pods -n fuel-friend
kubectl get svc -n fuel-friend
kubectl get ingress -n fuel-friend