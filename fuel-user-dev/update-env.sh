#!/bin/bash

echo "⚙️ Update Environment Variables untuk Fuel-User"
echo "================================================"

# Function to update secret
update_env() {
    local key=$1
    local value=$2
    
    echo "Updating $key..."
    kubectl patch secret fuel-user-env -n fuel-friend --type='json' \
        -p="[{\"op\": \"replace\", \"path\": \"/data/$key\", \"value\": \"$(echo -n "$value" | base64 -w 0)\"}]"
}

# Interactive update
echo "Masukkan nilai baru (tekan Enter untuk skip):"

read -p "DATABASE_URL: " db_url
if [ ! -z "$db_url" ]; then
    update_env "DATABASE_URL" "$db_url"
fi

read -p "SENDGRID_API_KEY: " sendgrid_key
if [ ! -z "$sendgrid_key" ]; then
    update_env "SENDGRID_API_KEY" "$sendgrid_key"
fi

read -p "STRIPE_SECRET_KEY: " stripe_key
if [ ! -z "$stripe_key" ]; then
    update_env "STRIPE_SECRET_KEY" "$stripe_key"
fi

read -p "JWT_SECRET: " jwt_secret
if [ ! -z "$jwt_secret" ]; then
    update_env "JWT_SECRET" "$jwt_secret"
fi

read -p "FIREBASE_PROJECT_ID: " firebase_project
if [ ! -z "$firebase_project" ]; then
    update_env "FIREBASE_PROJECT_ID" "$firebase_project"
fi

echo "✅ Environment variables updated!"
echo "🔄 Restart pod untuk apply changes:"
echo "kubectl rollout restart deployment/fuel-user -n fuel-friend"