#!/bin/bash

echo "🔐 Generating secure environment variables..."

# Generate JWT Secret (32 bytes random)
JWT_SECRET=$(openssl rand -base64 32)

# Generate random secrets
STRIPE_WEBHOOK_SECRET=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -base64 24)

echo "✅ Generated secrets:"
echo "JWT_SECRET=$JWT_SECRET"
echo "STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET" 
echo "SESSION_SECRET=$SESSION_SECRET"
echo ""

# Update Kubernetes secret
echo "🔄 Updating Kubernetes secret..."

kubectl patch secret fuel-user-env -n fuel-friend --type='json' -p="[
  {\"op\": \"replace\", \"path\": \"/data/JWT_SECRET\", \"value\": \"$(echo -n "$JWT_SECRET" | base64 -w 0)\"},
  {\"op\": \"replace\", \"path\": \"/data/STRIPE_WEBHOOK_SECRET\", \"value\": \"$(echo -n "$STRIPE_WEBHOOK_SECRET" | base64 -w 0)\"},
  {\"op\": \"replace\", \"path\": \"/data/SESSION_SECRET\", \"value\": \"$(echo -n "$SESSION_SECRET" | base64 -w 0)\"}
]"

echo "✅ Secrets updated in Kubernetes!"
echo "🔄 Restarting deployment..."

kubectl rollout restart deployment/fuel-user -n fuel-friend

echo "✅ Done! New secrets applied."