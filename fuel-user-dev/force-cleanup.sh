#!/bin/bash

echo "🔥 Force cleanup semua..."

# Force delete namespace yang stuck
kubectl patch namespace ingress-nginx -p '{"metadata":{"finalizers":[]}}' --type=merge 2>/dev/null || true
kubectl delete namespace ingress-nginx --force --grace-period=0 2>/dev/null || true

kubectl patch namespace metallb-system -p '{"metadata":{"finalizers":[]}}' --type=merge 2>/dev/null || true
kubectl delete namespace metallb-system --force --grace-period=0 2>/dev/null || true

# Hapus semua ingress dan services
kubectl delete ingress --all --all-namespaces --force --grace-period=0 2>/dev/null || true
kubectl delete svc --all -n ingress-nginx --force --grace-period=0 2>/dev/null || true

# Hapus Traefik bawaan K3s
kubectl delete -n kube-system helmchart traefik 2>/dev/null || true

echo "✅ Force cleanup selesai!"