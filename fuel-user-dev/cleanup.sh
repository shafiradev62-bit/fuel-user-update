#!/bin/bash

echo "🧹 Membersihkan semua load balancer dan ingress..."

# Hapus semua ingress
kubectl delete ingress --all --all-namespaces

# Hapus Traefik (jika ada)
kubectl delete -n kube-system helmchart traefik 2>/dev/null || true
kubectl delete -n kube-system deployment traefik 2>/dev/null || true
kubectl delete -n kube-system service traefik 2>/dev/null || true

# Hapus NGINX Ingress Controller
kubectl delete namespace ingress-nginx 2>/dev/null || true

# Hapus MetalLB
kubectl delete namespace metallb-system 2>/dev/null || true

# Tunggu sampai semua terhapus
echo "⏳ Menunggu cleanup selesai..."
sleep 30

echo "✅ Cleanup selesai!"