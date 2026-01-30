#!/bin/bash

echo "🔥 Complete cleanup..."

# Force delete semua
kubectl delete namespace ingress-nginx --force --grace-period=0 2>/dev/null || true
kubectl delete namespace metallb-system --force --grace-period=0 2>/dev/null || true
kubectl patch namespace ingress-nginx -p '{"metadata":{"finalizers":[]}}' --type=merge 2>/dev/null || true
kubectl patch namespace metallb-system -p '{"metadata":{"finalizers":[]}}' --type=merge 2>/dev/null || true

# Hapus semua ingress
kubectl delete ingress --all --all-namespaces --force --grace-period=0 2>/dev/null || true

sleep 10

echo "🚀 Installing MetalLB..."
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.12/config/manifests/metallb-native.yaml
kubectl wait --namespace metallb-system --for=condition=ready pod --selector=app=metallb --timeout=120s

echo "⚙️ Configuring MetalLB with IP 72.61.69.116..."
kubectl apply -f - <<EOF
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default-pool
  namespace: metallb-system
spec:
  addresses:
  - 72.61.69.116/32
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default
  namespace: metallb-system
spec:
  ipAddressPools:
  - default-pool
EOF

echo "📦 Installing NGINX Ingress..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s

echo "✅ Setup complete!"
kubectl get svc -n ingress-nginx