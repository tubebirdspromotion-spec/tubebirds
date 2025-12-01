# VPS Deployment Guide - TubeBirds MERN Stack

## Table of Contents
1. [Initial VPS Setup](#1-initial-vps-setup)
2. [Install Required Software](#2-install-required-software)
3. [Setup MySQL Database](#3-setup-mysql-database)
4. [Upload Project to VPS](#4-upload-project-to-vps)
5. [Configure Backend](#5-configure-backend)
6. [Configure Frontend](#6-configure-frontend)
7. [Setup Nginx Web Server](#7-setup-nginx-web-server)
8. [Setup SSL Certificate](#8-setup-ssl-certificate)
9. [Point Domain to VPS](#9-point-domain-to-vps)
10. [Verify Deployment](#10-verify-deployment)
11. [How to Update Code](#11-how-to-update-code)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Initial VPS Setup

### Step 1.1: Purchase Hostinger VPS
- Login to Hostinger account
- Go to VPS section
- Choose a plan (minimum 2GB RAM recommended)
- Complete purchase

### Step 1.2: Access VPS Details
- Go to Hostinger control panel
- Find your VPS section
- Note down:
  - **VPS IP Address**: (e.g., 123.45.67.89)
  - **SSH Username**: (usually `root`)
  - **SSH Password**: (provided by Hostinger)

### Step 1.3: Connect to VPS via SSH

**On Windows (using PowerShell or CMD):**
```powershell
ssh root@YOUR_VPS_IP
# Example: ssh root@123.45.67.89
```

**Or use PuTTY:**
- Download PuTTY from putty.org
- Open PuTTY
- Enter VPS IP in "Host Name"
- Click "Open"
- Login with username: `root` and your password

### Step 1.4: Update System
```bash
apt update && apt upgrade -y
```

---

## 2. Install Required Software

### Step 2.1: Install Node.js 18
```bash
# Download Node.js setup script
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2.2: Install Nginx
```bash
# Install Nginx web server
apt install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

### Step 2.3: Install PM2
```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

### Step 2.4: Install Git
```bash
# Install Git
apt install -y git

# Verify installation
git --version
```

### Step 2.5: Install Certbot (for SSL)
```bash
apt install -y certbot python3-certbot-nginx
```

---

## 3. Setup MySQL Database

### Option A: If MySQL is already on Hostinger
- You already have MySQL database from Hostinger
- Note down these details:
  - Database Host: (usually `localhost` or provided by Hostinger)
  - Database Name
  - Database Username
  - Database Password
  - Database Port: (usually `3306`)

### Option B: Install MySQL on VPS
```bash
# Install MySQL Server
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation

# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE tubebirds;
CREATE USER 'tubebirds_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON tubebirds.* TO 'tubebirds_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 4. Upload Project to VPS

### Step 4.1: Prepare Local Repository

**On your Windows machine (in VS Code terminal):**
```powershell
# Navigate to project directory
cd C:\Users\himan\OneDrive\Desktop\TubeBirds

# Make sure all changes are committed
git status
git add .
git commit -m "Prepare for VPS deployment"
git push origin main
```

### Step 4.2: Clone Project on VPS

**On VPS (via SSH):**
```bash
# Create web directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/tubebirdspromotion-spec/tubebirds.git

# Navigate to project
cd tubebirds
ls -la
```

---

## 5. Configure Backend

### Step 5.1: Install Backend Dependencies
```bash
cd /var/www/tubebirds/server
npm install
```

### Step 5.2: Create Environment File
```bash
nano .env
```

**Paste the following (update with your actual values):**
```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_NAME=tubebirds
DB_USER=tubebirds_user
DB_PASSWORD=your_database_password
DB_PORT=3306
DB_DIALECT=mysql

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Frontend URL (update with your domain)
FRONTEND_URL=https://yourdomain.com
CLIENT_URL=https://yourdomain.com

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stripe Configuration (if using)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Configuration (Hostinger Email)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourdomain.com

# Cloudinary Configuration (if using for images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

**Save the file:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

### Step 5.3: Run Database Migrations/Seeds (if needed)
```bash
# If you have seed data
npm run seed

# Or run specific seed
npm run seed:data
```

### Step 5.4: Test Backend Locally on VPS
```bash
# Test run
npm start

# You should see: Server running on port 5000
# Press Ctrl+C to stop
```

### Step 5.5: Start Backend with PM2
```bash
# Start backend with PM2
pm2 start server.js --name tubebirds-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Copy and run the command that PM2 shows
# It will look like: sudo env PATH=$PATH:/usr/bin...

# Check status
pm2 status
pm2 logs tubebirds-api
```

---

## 6. Configure Frontend

### Step 6.1: Update API Endpoint in Frontend

**On VPS:**
```bash
cd /var/www/tubebirds/client/src/services
nano api.js
```

**Update the base URL:**
```javascript
// Change this line to use your domain
const API_BASE_URL = 'https://yourdomain.com/api';
```

**Save the file** (Ctrl+X, Y, Enter)

### Step 6.2: Install Frontend Dependencies
```bash
cd /var/www/tubebirds/client
npm install
```

### Step 6.3: Build Frontend for Production
```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Step 6.4: Verify Build
```bash
ls -la dist
# You should see index.html, assets folder, etc.
```

---

## 7. Setup Nginx Web Server

### Step 7.1: Create Nginx Configuration File
```bash
nano /etc/nginx/sites-available/tubebirds
```

### Step 7.2: Add Nginx Configuration

**Paste the following (replace `yourdomain.com` with your actual domain):**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - Serve React build
    root /var/www/tubebirds/client/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for long requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

**Save the file** (Ctrl+X, Y, Enter)

### Step 7.3: Enable the Site
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/tubebirds /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# If test passes, restart Nginx
systemctl restart nginx

# Check Nginx status
systemctl status nginx
```

---

## 8. Setup SSL Certificate

### Step 8.1: Obtain SSL Certificate
```bash
# Run Certbot
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 8.2: Follow Certbot Prompts
- Enter your email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (choose Yes/2)

### Step 8.3: Verify SSL
```bash
# Check certificate renewal
certbot renew --dry-run
```

### Step 8.4: Auto-renewal Setup
Certbot automatically sets up a cron job, but verify:
```bash
systemctl status certbot.timer
```

---

## 9. Point Domain to VPS

### Step 9.1: Get VPS IP Address
```bash
# On VPS, get IP address
curl ifconfig.me
# Note down this IP
```

### Step 9.2: Update DNS Records

**In Hostinger DNS Management (or your domain registrar):**

1. Go to Domain DNS settings
2. Add/Update these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP | 14400 |
| A | www | YOUR_VPS_IP | 14400 |

3. Save changes

### Step 9.3: Wait for DNS Propagation
- Usually takes 10-30 minutes
- Can take up to 48 hours in some cases

### Step 9.4: Check DNS Propagation
```bash
# On your Windows machine
nslookup yourdomain.com
```

---

## 10. Verify Deployment

### Step 10.1: Check Backend
```bash
# On VPS
pm2 status
pm2 logs tubebirds-api

# Test API endpoint
curl http://localhost:5000/api/health
```

### Step 10.2: Check Nginx
```bash
systemctl status nginx
nginx -t
```

### Step 10.3: Check Website
- Open browser: `https://yourdomain.com`
- Test all pages
- Test user registration/login
- Test making an order
- Check contact form
- Verify email sending

### Step 10.4: Check SSL
- URL should show `https://`
- Padlock icon should appear in browser
- Click padlock to verify certificate

---

## 11. How to Update Code

### When You Make Changes Locally

#### Step 11.1: Make Changes on Local Machine
- Edit files in VS Code
- Test locally if needed

#### Step 11.2: Commit and Push Changes

**On Windows (in VS Code terminal):**
```powershell
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Description of changes made"

# Push to GitHub
git push origin main
```

#### Step 11.3: Pull Changes on VPS

**On VPS (via SSH):**
```bash
# Navigate to project
cd /var/www/tubebirds

# Pull latest changes
git pull origin main
```

#### Step 11.4: Update Backend (if backend files changed)

```bash
# Navigate to server
cd /var/www/tubebirds/server

# Install new dependencies (if package.json changed)
npm install

# Restart backend
pm2 restart tubebirds-api

# Check logs
pm2 logs tubebirds-api
```

#### Step 11.5: Update Frontend (if frontend files changed)

```bash
# Navigate to client
cd /var/www/tubebirds/client

# Install new dependencies (if package.json changed)
npm install

# Rebuild production files
npm run build

# No need to restart anything - Nginx serves the new files automatically
```

#### Step 11.6: Verify Changes
- Visit your website
- Test the changes you made
- Check browser console for errors (F12)

---

## 12. Troubleshooting

### Backend Issues

#### Backend Not Starting
```bash
# Check PM2 status
pm2 status

# View detailed logs
pm2 logs tubebirds-api --lines 100

# Restart backend
pm2 restart tubebirds-api

# If still issues, stop and start fresh
pm2 delete tubebirds-api
cd /var/www/tubebirds/server
pm2 start server.js --name tubebirds-api
```

#### Database Connection Issues
```bash
# Check MySQL is running
systemctl status mysql

# Test database connection
mysql -u tubebirds_user -p tubebirds

# Check .env file
cd /var/www/tubebirds/server
cat .env
```

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Frontend Issues

#### Website Not Loading
```bash
# Check Nginx status
systemctl status nginx

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Verify build files exist
ls -la /var/www/tubebirds/client/dist

# Restart Nginx
systemctl restart nginx
```

#### API Calls Failing
1. Check browser console (F12) for errors
2. Verify API URL in `client/src/services/api.js`
3. Check CORS settings in `server/server.js`
4. Verify backend is running: `pm2 status`

#### CSS/Images Not Loading
```bash
# Rebuild frontend
cd /var/www/tubebirds/client
npm run build

# Check file permissions
ls -la dist/
chmod -R 755 dist/
```

### SSL Issues

#### Certificate Not Working
```bash
# Test Nginx configuration
nginx -t

# Renew certificate manually
certbot renew

# Force certificate renewal
certbot renew --force-renewal
```

#### Mixed Content Warning
- Update all API calls to use `https://`
- Check `client/src/services/api.js` uses `https://`

### General Commands

#### Check All Services
```bash
# Backend
pm2 status

# Nginx
systemctl status nginx

# MySQL
systemctl status mysql

# View all logs
pm2 logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

#### Restart Everything
```bash
# Restart backend
pm2 restart all

# Restart Nginx
systemctl restart nginx

# Restart MySQL (if needed)
systemctl restart mysql
```

#### View Resource Usage
```bash
# CPU and Memory
htop
# or
top

# Disk space
df -h

# PM2 monitoring
pm2 monit
```

---

## Quick Reference Commands

### Connecting to VPS
```bash
ssh root@YOUR_VPS_IP
```

### Backend Commands
```bash
# Status
pm2 status

# Logs
pm2 logs tubebirds-api

# Restart
pm2 restart tubebirds-api

# Stop
pm2 stop tubebirds-api

# Start
pm2 start tubebirds-api
```

### Frontend Commands
```bash
cd /var/www/tubebirds/client
npm run build
```

### Nginx Commands
```bash
# Test configuration
nginx -t

# Restart
systemctl restart nginx

# Status
systemctl status nginx

# Logs
tail -f /var/log/nginx/error.log
```

### Update Workflow
```bash
# 1. On local machine
git add .
git commit -m "message"
git push origin main

# 2. On VPS
cd /var/www/tubebirds
git pull origin main

# 3. If backend changed
cd server
npm install
pm2 restart tubebirds-api

# 4. If frontend changed
cd client
npm install
npm run build
```

---

## Important Notes

1. **Always backup database before major updates**
   ```bash
   mysqldump -u tubebirds_user -p tubebirds > backup_$(date +%Y%m%d).sql
   ```

2. **Keep environment variables secure**
   - Never commit `.env` file to GitHub
   - Use strong passwords
   - Rotate secrets regularly

3. **Monitor your application**
   ```bash
   pm2 monit
   ```

4. **Set up firewall**
   ```bash
   ufw allow 22    # SSH
   ufw allow 80    # HTTP
   ufw allow 443   # HTTPS
   ufw enable
   ```

5. **Regular updates**
   ```bash
   apt update && apt upgrade -y
   ```

---

## Support

If you encounter issues:
1. Check logs: `pm2 logs` and `tail -f /var/log/nginx/error.log`
2. Verify all services are running
3. Check DNS propagation
4. Verify environment variables
5. Test database connection

---

**Deployment Complete! 🎉**

Your MERN stack application is now live on Hostinger VPS.
