#!/bin/bash

# FuelFriendly VPS Setup Script
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[SETUP]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system
setup_system() {
    log "Updating system packages..."
    apt update && apt upgrade -y
    
    log "Installing required packages..."
    apt install -y curl wget git nginx certbot python3-certbot-nginx ufw fail2ban
}

# Install Docker
install_docker() {
    log "Installing Docker..."
    
    # Remove old versions
    apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Add user to docker group
    usermod -aG docker $USER
    
    log "Docker installed successfully"
}

# Install Node.js
install_nodejs() {
    log "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    
    log "Node.js $(node --version) installed"
}

# Setup firewall
setup_firewall() {
    log "Configuring firewall..."
    
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH, HTTP, HTTPS
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow backend port (internal)
    ufw allow from 172.16.0.0/12 to any port 4000
    
    ufw --force enable
    
    log "Firewall configured"
}

# Setup SSL certificate
setup_ssl() {
    read -p "Enter your domain name (e.g., fuelfriendly.com): " DOMAIN
    read -p "Enter your email for SSL certificate: " EMAIL
    
    if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
        warn "Domain or email not provided. Skipping SSL setup."
        return
    fi
    
    log "Setting up SSL certificate for $DOMAIN..."
    
    # Stop nginx temporarily
    systemctl stop nginx
    
    # Get certificate
    certbot certonly --standalone -d $DOMAIN --email $EMAIL --agree-tos --non-interactive
    
    # Create SSL directory and copy certificates
    mkdir -p /var/www/fuel-user/ssl
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /var/www/fuel-user/ssl/cert.pem
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /var/www/fuel-user/ssl/key.pem
    
    # Setup auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /var/www/fuel-user/ssl/cert.pem && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /var/www/fuel-user/ssl/key.pem && docker-compose -f /var/www/fuel-user/docker-compose.yml restart frontend" | crontab -
    
    log "SSL certificate configured for $DOMAIN"
}

# Clone project
clone_project() {
    log "Cloning FuelFriendly project..."
    
    cd /var/www
    
    if [ -d "fuel-user" ]; then
        warn "Project directory exists. Backing up..."
        mv fuel-user fuel-user-backup-$(date +%Y%m%d-%H%M%S)
    fi
    
    # Clone repository
    read -p "Enter Git repository URL: " REPO_URL
    git clone $REPO_URL fuel-user
    
    cd fuel-user
    chmod +x deploy.sh
    
    log "Project cloned successfully"
}

# Setup environment
setup_environment() {
    log "Setting up environment files..."
    
    cd /var/www/fuel-user
    
    # Backend environment
    if [ ! -f "backend/.env.local" ]; then
        cp backend/.env.local.template backend/.env.local
        warn "Please edit backend/.env.local with your configuration"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env.local" ]; then
        cp frontend/.env.local.template frontend/.env.local
        warn "Please edit frontend/.env.local with your configuration"
    fi
}

# Setup auto-deployment
setup_auto_deploy() {
    log "Setting up auto-deployment..."
    
    # Create webhook script
    cat > /usr/local/bin/fuel-deploy-webhook << 'EOF'
#!/bin/bash
cd /var/www/fuel-user
./deploy.sh >> /var/log/fuel-deploy.log 2>&1
EOF
    
    chmod +x /usr/local/bin/fuel-deploy-webhook
    
    # Setup cron for periodic updates (optional)
    echo "0 2 * * * /var/www/fuel-user/deploy.sh >> /var/log/fuel-deploy.log 2>&1" | crontab -
    
    log "Auto-deployment configured"
}

# Create directories
create_directories() {
    log "Creating required directories..."
    
    mkdir -p /var/www
    mkdir -p /var/backups/fuel-user
    mkdir -p /var/log
    
    touch /var/log/fuel-deploy.log
    chmod 644 /var/log/fuel-deploy.log
}

# Main setup
main() {
    log "🚀 Starting FuelFriendly VPS setup..."
    
    create_directories
    setup_system
    install_docker
    install_nodejs
    setup_firewall
    clone_project
    setup_environment
    setup_ssl
    setup_auto_deploy
    
    log "✅ VPS setup completed!"
    log ""
    log "Next steps:"
    log "1. Edit environment files in /var/www/fuel-user/"
    log "2. Run: cd /var/www/fuel-user && ./deploy.sh"
    log "3. Setup webhook: curl -X POST http://your-server/webhook"
    log ""
    log "Logs: tail -f /var/log/fuel-deploy.log"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    error "Please run as root (use sudo)"
    exit 1
fi

main "$@"