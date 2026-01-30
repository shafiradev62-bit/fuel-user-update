#!/bin/bash

echo "🚀 Setup K3s Load Balancer dan Ingress..."

# 1. Install MetalLB
echo "📦 Installing MetalLB..."
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.12/config/manifests/metallb-native.yaml

# Tunggu MetalLB ready
echo "⏳ Menunggu MetalLB ready..."
kubectl wait --namespace metallb-system --for=condition=ready pod --selector=app=metallb --timeout=90s

# 2. Apply MetalLB config
echo "⚙️ Configuring MetalLB..."
kubectl apply -f metallb-config.yaml

# 3. Install NGINX Ingress
echo "📦 Installing NGINX Ingress Controller..."
kubectl apply -f nginx-ingress.yaml

# Tunggu NGINX ready
echo "⏳ Menunggu NGINX Ingress ready..."
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app=nginx-ingress-controller --timeout=90s

# 4. Cek status
echo "🔍 Checking status..."
kubectl get pods -n metallb-system
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx

echo "✅ Setup selesai!"
echo "🌐 External IP akan muncul dalam beberapa menit"