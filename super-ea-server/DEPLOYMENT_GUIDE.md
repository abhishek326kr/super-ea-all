# ContentNexus Backend - Deployment Guide

Complete step-by-step guide to deploy the FastAPI backend server.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Requirements](#server-requirements)
3. [Deployment Steps](#deployment-steps)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Server](#running-the-server)
7. [Process Management](#process-management)
8. [Nginx Reverse Proxy](#nginx-reverse-proxy)
9. [SSL Certificate](#ssl-certificate)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Python**: 3.10+ installed
- **PostgreSQL**: Database server accessible
- **Git**: For cloning the repository
- **Domain**: (Optional) For production deployment with SSL

---

## Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 core | 2+ cores |
| RAM | 1 GB | 2+ GB |
| Storage | 5 GB | 10+ GB |
| OS | Ubuntu 20.04+ / Debian 11+ | Ubuntu 22.04 LTS |

---

## Deployment Steps

### Step 1: Connect to Your Server

```bash
ssh user@your-server-ip
```

### Step 2: Install System Dependencies

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Install PostgreSQL client (if connecting to remote DB)
sudo apt install libpq-dev -y

# Install Git
sudo apt install git -y
```

### Step 3: Clone the Repository

```bash
# Navigate to your preferred directory
cd /var/www

# Clone the repository (replace with your repo URL)
git clone https://github.com/your-repo/yoforex-super-ea-server.git
cd yoforex-super-ea-server
```

### Step 4: Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### Step 5: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Dependencies installed:**
- fastapi, uvicorn (Web framework)
- sqlalchemy, psycopg2-binary, alembic (Database)
- boto3 (R2/S3 storage)
- python-jose, passlib (Authentication)
- Pillow (Image processing)
- openai, google.generativeai (AI content generation)

---

## Environment Configuration

### Step 6: Create .env File

```bash
nano .env
```

**Add the following configuration:**

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# AI API Keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here
XAI_API_KEY=xai-your-key-here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# JWT Authentication
SECRET_KEY=your-random-secret-key-minimum-32-characters
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Cloudflare R2 Storage (Default bucket)
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

> ⚠️ **Security Note**: Never commit `.env` to version control. Use `.env.example` as a template.

---

## Database Setup

### Step 7: Run Database Migrations

```bash
# Ensure venv is activated
source venv/bin/activate

# Run all pending migrations
alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Running upgrade xxx -> yyy, migration_name
```

---

## Running the Server

### Step 8: Test Run (Development Mode)

```bash
# Activate venv
source venv/bin/activate

# Run in development mode
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Verify:** Open `http://your-server-ip:8000/docs` to see the API documentation.

### Step 9: Production Run

```bash
# Run without reload, with multiple workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Process Management

### Step 10: Create Systemd Service (Recommended)

```bash
sudo nano /etc/systemd/system/contentnexus.service
```

**Add the following:**

```ini
[Unit]
Description=ContentNexus FastAPI Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/yoforex-super-ea-server
Environment="PATH=/var/www/yoforex-super-ea-server/venv/bin"
EnvironmentFile=/var/www/yoforex-super-ea-server/.env
ExecStart=/var/www/yoforex-super-ea-server/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

**Enable and start the service:**

```bash
# Set correct ownership
sudo chown -R www-data:www-data /var/www/yoforex-super-ea-server

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable contentnexus

# Start the service
sudo systemctl start contentnexus

# Check status
sudo systemctl status contentnexus
```

**Useful commands:**
```bash
sudo systemctl restart contentnexus  # Restart service
sudo systemctl stop contentnexus     # Stop service
sudo journalctl -u contentnexus -f   # View logs
```

---

## Nginx Reverse Proxy

### Step 11: Install and Configure Nginx

```bash
sudo apt install nginx -y
```

**Create Nginx configuration:**

```bash
sudo nano /etc/nginx/sites-available/contentnexus
```

**Add the following:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for AI generation
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        
        # Increase max body size for image uploads
        client_max_body_size 20M;
    }
}
```

**Enable the configuration:**

```bash
sudo ln -s /etc/nginx/sites-available/contentnexus /etc/nginx/sites-enabled/
sudo nginx -t          # Test configuration
sudo systemctl reload nginx
```

---

## SSL Certificate

### Step 12: Install SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Certificate will auto-renew. Test renewal with:
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Port 8000 in use** | `sudo lsof -i :8000` to find process, then kill it |
| **Permission denied on .env** | `sudo chown www-data:www-data .env` |
| **Database connection failed** | Check `DATABASE_URL` format and firewall rules |
| **Alembic migration error** | Check migration history: `alembic history` |
| **502 Bad Gateway** | Check if uvicorn is running: `systemctl status contentnexus` |
| **Timeout on AI generation** | Increase Nginx proxy timeouts |

### View Logs

```bash
# Application logs
sudo journalctl -u contentnexus -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Health Check

```bash
# Check if API is responding
curl http://localhost:8000/docs

# Check from external
curl https://api.yourdomain.com/docs
```

---

## Quick Reference

```bash
# Start
sudo systemctl start contentnexus

# Stop
sudo systemctl stop contentnexus

# Restart
sudo systemctl restart contentnexus

# View Logs
sudo journalctl -u contentnexus -f

# Update Code
cd /var/www/yoforex-super-ea-server
git pull
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart contentnexus
```

---

## Deployment Checklist

- [ ] Server provisioned with required specs
- [ ] Python 3.10+ installed
- [ ] Repository cloned
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] `.env` file configured
- [ ] Database migrations run
- [ ] Systemd service created and enabled
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Firewall configured (ports 80, 443 open)
- [ ] Health check passed
