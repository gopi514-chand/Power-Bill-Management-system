# ⚡ PowerBill - Quick Start Guide

## 🎯 30-Second Overview

A complete **bill calculator + database system** that lets you:
- ✅ Calculate electricity bills automatically
- ✅ Store bills in MySQL database
- ✅ View comprehensive billing reports
- ✅ Filter, analyze, and export data
- ✅ Print professional invoices

---

## ⚙️ Setup in 5 Steps

### Step 1: Database (1 min)
```bash
mysql -u root -p < database_setup.sql
```

### Step 2: Install (1 min)
```bash
cd "g:\web technology\html"
npm install
```

### Step 3: Configure (1 min)
```bash
cp .env.example .env
# Edit .env and add your MySQL password
```

### Step 4: Start (1 min)
```bash
npm run dev
```

### Step 5: Use (1 min)
Open browser: `http://localhost:3000`

✅ **Done! You're ready to calculate bills.**

---

## 📖 How to Use

### Calculate a Bill

1. Go to **Bill Calculator**
2. Enter consumer details:
   ```
   Consumer ID: PWR-001
   Name: John Doe
   Meter Type: Domestic
   ```
3. Enter readings:
   ```
   Previous Reading: 1000 kWh
   Current Reading: 1150 kWh
   (Auto-calculates: 150 kWh)
   ```
4. Set rates:
   ```
   Rate: ₹6.50/kWh
   Fixed Charge: ₹100
   GST: 5%
   ```
5. Click **Calculate Bill** → **Save to Database**

### View Reports

1. Go to **Billing Reports**
2. Filter by:
   - Consumer ID
   - Consumer Name
   - Meter Type
   - Date Range
3. See statistics and export to CSV

---

## 📁 What You Get

| File | Purpose |
|------|---------|
| `billing_calculator.html` | Calculate bills |
| `billing_reports.html` | View & analyze reports |
| `server.js` | Backend API |
| `database_setup.sql` | Create database |
| `README.md` | Full documentation |
| `INSTALLATION.md` | Detailed setup guide |

---

## 🔧 Troubleshooting

### MySQL not working?
```bash
# Start MySQL service
Windows: net start MySQL80
Mac: brew services start mysql
Linux: sudo systemctl start mysql
```

### Port 3000 in use?
Edit `.env` and change: `PORT=3001`

### npm install failed?
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

More help: See **INSTALLATION.md**

---

## 📊 Features at a Glance

```
CALCULATOR
├─ Auto-calculate units consumed
├─ Calculate energy charges
├─ Apply taxes (GST)
├─ Print professional bills
└─ Save to database

REPORTS
├─ View all bills
├─ Filter & search
├─ See statistics
├─ Export to CSV
└─ Delete records

DATABASE
├─ MySQL storage
├─ LocalStorage backup
├─ Optimized indexes
└─ Analytics views
```

---

## 💡 Quick Tips

- **Try calculator first** with sample data before connecting to database
- **Use LocalStorage backup** if server unavailable
- **Export to CSV** for Excel analysis
- **Check statistics** to see billing trends

---

## 📱 Works On

✓ Windows  
✓ Mac  
✓ Linux  
✓ Mobile (responsive)  
✓ All modern browsers

---

## 🚀 What's Next?

- Create your first bill
- Generate reports
- Analyze data
- Deploy to production (see INSTALLATION.md)

---

## 📞 Need Help?

1. **Quick issues:** Check INSTALLATION.md
2. **How-to questions:** Read README.md
3. **Code reference:** See comments in files
4. **Setup details:** Check IMPLEMENTATION_SUMMARY.md

---

## 📄 Important Files

- **README.md** - Complete documentation
- **INSTALLATION.md** - Platform-specific setup
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **database_setup.sql** - Database schema
- **.env.example** - Configuration template

---

## ✨ Key Highlights

🎯 **Complete Solution**
All-in-one: calculator + database + reports

🚀 **Production-Ready**
Error handling, security, optimization included

📊 **Powerful Analytics**
Filter, analyze, and export billing data

💾 **Reliable Storage**
MySQL database with automatic backups

👤 **User-Friendly**
Intuitive interface, professional output

---

## 🎓 Stack

**Frontend:** HTML, CSS, JavaScript, Bootstrap  
**Backend:** Node.js, Express  
**Database:** MySQL  
**API:** RESTful endpoints  

---

**Status: ✅ Ready to Use**  
**Last Updated:** May 26, 2026

Happy billing! ⚡

---

### Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Database setup
mysql -u root -p < database_setup.sql

# Access application
http://localhost:3000
```

### File Locations

```
g:\web technology\html\
  ├─ billing_calculator.html (Calculator UI)
  ├─ billing_reports.html (Reports UI)
  ├─ server.js (Backend)
  ├─ database_setup.sql (Database)
  └─ README.md (Full docs)
```

---

**Made with ❤️ for Power Billing**
