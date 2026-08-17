# PowerBill - Electricity Bill Calculator with Database

A comprehensive web application for calculating electricity bills and storing billing records in a database.

**#URL:** https://gopi514-chand.github.io/Power-Bill-Management-system/

## Features

✅ **Bill Calculator**
- Auto-calculate units consumed from meter readings
- Calculate energy charges based on consumption and tariff
- Apply fixed charges and additional fees
- Calculate GST and total bill amount
- Save bills to database
- Print bills in a professional format

✅ **Billing Reports**
- View all billing records with pagination
- Filter bills by Consumer ID, Name, Meter Type, and Date Range
- Summary statistics (Total Bills, Total Amount, Average Bill)
- Export billing data to CSV
- View detailed bill information
- Delete old billing records

✅ **Database Storage**
- MySQL database for persistent storage
- Backup with browser's LocalStorage
- Monthly billing summaries
- Consumer billing history views
- Payment status tracking

✅ **Responsive Design**
- Bootstrap 5 UI framework
- Mobile-friendly interface
- Professional styling
- Intuitive user experience

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm package manager

### Step 1: Database Setup

1. **Create Database**
   - Open MySQL Command Line or MySQL Workbench
   - Run the SQL script: `database_setup.sql`
   
   ```bash
   mysql -u root -p < database_setup.sql
   ```

2. **Verify Database**
   ```sql
   USE powerbill_db;
   SELECT * FROM bills;
   ```

### Step 2: Install Dependencies

```bash
cd "g:\web technology\html"
npm install
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=powerbill_db
   PORT=3000
   ```

### Step 4: Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## Usage Guide

### 1. Calculate a Bill

1. Open the **Bill Calculator** page
2. Fill in consumer details:
   - Consumer ID (e.g., PWR-001)
   - Consumer Name
   - Meter Type (Domestic/Commercial/Industrial)

3. Enter meter readings:
   - Previous Reading (kWh)
   - Current Reading (kWh)
   - Units consumed auto-calculates

4. Set tariff details:
   - Rate per Unit (₹/kWh)
   - Fixed Charge (₹)
   - GST Percentage (default: 5%)
   - Additional Charges (if any)

5. Click **Calculate Bill**
6. Review the bill summary
7. Click **Save to Database** to store permanently

### 2. View Billing Reports

1. Navigate to **Billing Reports** page
2. Apply filters:
   - Search by Consumer ID
   - Search by Consumer Name
   - Filter by Meter Type
   - Select Date Range

3. View statistics:
   - Total Bills Count
   - Total Amount Billed
   - Total Units Consumed
   - Average Bill Amount

4. Manage records:
   - View full bill details
   - Delete old records
   - Export to CSV

### 3. Export Data

1. Go to **Billing Reports**
2. Apply desired filters
3. Click **Export to CSV**
4. File downloads as `billing-report-YYYY-MM-DD.csv`

---

## Database Schema

### Bills Table
```
- id: Auto-increment bill ID
- consumer_id: Unique consumer identifier
- consumer_name: Consumer full name
- meter_type: domestic/commercial/industrial
- units_consumed: kWh consumed
- rate_per_unit: ₹/kWh tariff rate
- fixed_charge: Monthly fixed charge (₹)
- additional_charges: Extra charges (₹)
- energy_charge: Units × Rate
- subtotal: Energy + Fixed + Additional
- gst_percentage: Tax percentage
- gst_amount: Calculated tax amount
- total_bill: Final amount due
- billing_date: Bill generation date
- payment_status: pending/paid/overdue
- created_at: Record creation timestamp
- updated_at: Last update timestamp
```

---

## API Endpoints

### Bill Operations
```
POST   /api/bills/save              - Save new bill
GET    /api/bills/all               - Get all bills
GET    /api/bills/:id               - Get bill by ID
GET    /api/bills/consumer/:id      - Get consumer's bills
PUT    /api/bills/:id               - Update bill
DELETE /api/bills/:id               - Delete bill
```

### Reports
```
GET    /api/reports/summary         - Overall summary statistics
GET    /api/reports/monthly         - Monthly billing summary
```

---

## File Structure

```
html/
├── billing_calculator.html        # Main calculator interface
├── billing_calculator.js          # Calculator logic
├── billing_calculator.css         # Calculator styling
├── billing_reports.html           # Reports & history page
├── billing_reports.js             # Reports logic
├── server.js                      # Node.js/Express backend
├── database_setup.sql             # MySQL database schema
├── package.json                   # Node dependencies
├── .env.example                   # Environment template
└── README.md                      # This file
```

---

## Features in Detail

### Auto-Calculation
- Units consumed calculated automatically
- Energy charge = Units × Rate
- Total with taxes calculated in real-time

### Data Persistence
- **Primary:** MySQL database
- **Backup:** Browser LocalStorage (if server unavailable)
- Automatic fallback to local storage when server is down

### Statistics & Analytics
- Total bills count
- Total amount billed
- Average bill per consumer
- Monthly trend analysis
- Per-meter-type summaries

### Printing & Export
- Professional bill printing
- CSV export for Excel analysis
- Print-friendly formatting
- Detailed invoice layout

---

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Ensure MySQL server is running
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Database Not Found
```
Error: Unknown database 'powerbill_db'
```
**Solution:** Run the database setup script again
```bash
mysql -u root -p < database_setup.sql
```

### Server Not Starting
**Solution:** Check if port 3000 is already in use
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```
Change PORT in `.env` if needed.

### LocalStorage Full
The browser's localStorage can save ~5MB of data. For larger datasets, use the database instead.

---

## Sample Data

The database comes with sample bills:
- **PWR-001:** John Doe (Domestic) - ₹1,132.16
- **PWR-002:** Jane Smith (Commercial) - ₹4,200.00
- **PWR-003:** ABC Industries (Industrial) - ₹17,430.00

---

## Performance Tips

1. **For Large Datasets:**
   - Use database instead of localStorage
   - Implement pagination (already done)
   - Archive old bills regularly

2. **Browser Performance:**
   - Clear old LocalStorage data
   - Use modern browsers (Chrome, Firefox, Safari)

3. **Server Performance:**
   - Use database indexes (already optimized)
   - Implement caching for reports
   - Monitor query performance

---

## Security Considerations

- Validate all inputs on server
- Use HTTPS in production
- Sanitize database inputs
- Implement authentication for production
- Use environment variables for sensitive data
- Never commit `.env` file to version control

---

## Future Enhancements

- User authentication & authorization
- Payment gateway integration
- SMS/Email bill notifications
- Payment history & status tracking
- Consumption analytics & charts
- Multiple languages support
- Mobile app (React Native)
- Invoice customization

---

## Support & Feedback

For issues, suggestions, or contributions:
- Review the code and comments
- Check existing issues in database logs
- Test with sample data first

---

## License

MIT License - Feel free to use and modify

---

## Version History

**v1.0.0** (May 2026)
- Initial release
- Bill calculator with MySQL storage
- Billing reports and export
- LocalStorage backup

---

**Created:** May 26, 2026  
**Last Updated:** May 26, 2026
