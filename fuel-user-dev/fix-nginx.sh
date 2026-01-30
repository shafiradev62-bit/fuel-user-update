#!/bin/bash

echo "🔄 Menunggu namespace terhapus..."

# Tunggu sampai namespace benar-benar terhapus
while kubectl get namespace ingress-nginx 2>/dev/null; do
  echo "⏳ Namespace ingress-nginx masih terminating..."
  sleep 5
done

echo "✅ Namespace terhapus, installing NGINX Ingress..."

# Install NGINX Ingress Controller versi official
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Tunggu ready
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=90s

echo "🔧 Patching service untuk MetalLB..."
kubectl patch svc ingress-nginx-controller -n ingress-nginx -p '{"spec": {"type": "LoadBalancer"}}'

echo "✅ Setup selesai!"
kubectl get svc -n ingress-nginx