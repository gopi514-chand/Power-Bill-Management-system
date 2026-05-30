# PowerBill Installation & Deployment Guide

## Quick Start (5 Minutes)

### 1️⃣ Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Create database and tables
source database_setup.sql

# Verify
USE powerbill_db;
SELECT COUNT(*) FROM bills;
```

### 2️⃣ Install Dependencies

```bash
cd "g:\web technology\html"
npm install
```

### 3️⃣ Configure Environment

Copy `.env.example` to `.env` and update:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=powerbill_db
PORT=3000
```

### 4️⃣ Start Server

```bash
# Development (with auto-reload)
npm run dev

# Or production
npm start
```

✅ **Done!** Open `http://localhost:3000`

---

## Detailed Installation

### Windows Setup

#### A. Install MySQL

1. Download from https://dev.mysql.com/downloads/mysql/
2. Run installer
3. Choose "Server only"
4. Complete installation wizard
5. Start MySQL Service:
   ```bash
   net start MySQL80
   ```

#### B. Install Node.js

1. Download from https://nodejs.org/
2. Install v16 or higher
3. Verify:
   ```bash
   node --version
   npm --version
   ```

#### C. Set Up Database

1. Open MySQL Command Line Client
2. Enter root password
3. Run:
   ```sql
   source "g:\web technology\html\database_setup.sql"
   ```

#### D. Configure Application

1. Open `g:\web technology\html\`
2. Create `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=powerbill_db
   PORT=3000
   ```

#### E. Install & Run

```bash
cd "g:\web technology\html"
npm install
npm run dev
```

### Mac Setup

#### A. Install MySQL

```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

#### B. Install Node.js

```bash
brew install node
node --version
```

#### C. Set Up Database

```bash
mysql -u root -p < database_setup.sql
```

#### D. Configure & Run

```bash
cd html/
cp .env.example .env
# Edit .env with your password
npm install
npm run dev
```

### Linux Setup

#### A. Install MySQL

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

#### B. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

#### C. Set Up Database

```bash
mysql -u root -p < database_setup.sql
```

#### D. Configure & Run

```bash
cd html/
cp .env.example .env
nano .env  # Edit database password
npm install
npm run dev
```

---

## Verification Checklist

- [ ] MySQL running and accessible
- [ ] Database `powerbill_db` created
- [ ] `bills` table with sample data
- [ ] Node.js v14+ installed
- [ ] Dependencies installed (npm install completed)
- [ ] `.env` file configured with DB credentials
- [ ] Server starts without errors
- [ ] Can access `http://localhost:3000`
- [ ] Calculator page loads
- [ ] Can calculate and save bills
- [ ] Reports page displays data

---

## Troubleshooting

### MySQL Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
```bash
# Check if MySQL is running
Windows: services.msc → look for MySQL
Mac: brew services list
Linux: sudo systemctl status mysql

# Restart if needed
Windows: net stop MySQL80 && net start MySQL80
Mac: brew services restart mysql
Linux: sudo systemctl restart mysql
```

### Database Not Found

**Error:** `Error: Unknown database 'powerbill_db'`

**Solution:**
```bash
# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create if missing
mysql -u root -p < database_setup.sql
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# Change port in .env
PORT=3001

# Or kill process using port 3000
Windows: netstat -ano | findstr :3000 → taskkill /PID <PID> /F
Mac: lsof -i :3000 → kill -9 <PID>
Linux: lsof -i :3000 → sudo kill -9 <PID>
```

### npm install Fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Retry install
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

### Cannot Access localhost:3000

**Solution:**
1. Check server is running (no errors in terminal)
2. Try `http://127.0.0.1:3000`
3. Check firewall isn't blocking port 3000
4. Clear browser cache (Ctrl+Shift+Delete)

---

## Production Deployment

### Environment Variables

Create `.env` for production:
```env
DB_HOST=production-db-host
DB_USER=production_user
DB_PASSWORD=strong_password_here
DB_NAME=powerbill_db
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Database Optimization

```sql
-- Add indexes for better performance
ALTER TABLE bills ADD INDEX idx_consumer_id (consumer_id);
ALTER TABLE bills ADD INDEX idx_billing_date (billing_date);

-- Create backup
mysqldump -u root -p powerbill_db > backup.sql

-- Restore from backup
mysql -u root -p powerbill_db < backup.sql
```

### Security Checklist

- [ ] Update all npm packages to latest versions
- [ ] Use HTTPS (SSL certificate)
- [ ] Implement user authentication
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Use strong database password
- [ ] Regular backups scheduled
- [ ] Monitor server logs
- [ ] Use environment variables for secrets

### Deployment with PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "powerbill"

# Auto-restart on system reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs powerbill
```

### Deployment with Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Run:
```bash
docker build -t powerbill .
docker run -p 3000:3000 --env-file .env powerbill
```

---

## Regular Maintenance

### Weekly
- Check server logs for errors
- Monitor disk space
- Verify backups completed

### Monthly
- Update npm packages: `npm update`
- Archive old bills
- Review database performance

### Quarterly
- Update Node.js if major version available
- Security audit of code
- Disaster recovery test

### Yearly
- Full security assessment
- Database optimization
- Update SSL certificate

---

## Support Resources

- **Node.js Docs:** https://nodejs.org/docs/
- **Express Docs:** https://expressjs.com/
- **MySQL Docs:** https://dev.mysql.com/doc/
- **Bootstrap Docs:** https://getbootstrap.com/docs/
- **Git Issues:** Check GitHub for known issues

---

## Performance Optimization

### Database

```sql
-- Analyze table performance
ANALYZE TABLE bills;

-- Check slow queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### Node.js

```bash
# Monitor memory usage
node --max-old-space-size=2048 server.js

# Use clustering
npm install cluster
```

### Caching

Add Redis for session caching:
```bash
npm install redis express-session
```

---

## Backup & Recovery

### Automated Backup

```bash
# Create backup script (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p powerbill_db > backup_$DATE.sql
gzip backup_$DATE.sql
```

### Schedule with Cron (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/user/backup.sh
```

### Restore Procedure

```bash
# List backups
ls -la backup_*.sql

# Restore specific backup
mysql -u root -p powerbill_db < backup_20260526_140000.sql

# Verify
SELECT COUNT(*) FROM bills;
```

---

**Last Updated:** May 26, 2026  
**Version:** 1.0.0
