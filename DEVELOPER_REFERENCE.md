# 🎓 PowerBill - Developer Reference Guide

## Table of Contents
1. [System Architecture](#system-architecture)
2. [File Reference](#file-reference)
3. [Database Reference](#database-reference)
4. [API Reference](#api-reference)
5. [Code Examples](#code-examples)
6. [Common Tasks](#common-tasks)
7. [Performance Tips](#performance-tips)

---

## System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────┐
│         USER BROWSER (Frontend)             │
│  ┌────────────────────────────────────────┐ │
│  │  Bill Calculator (HTML/CSS/JS)         │ │
│  │  - Form input & validation             │ │
│  │  - Real-time calculations              │ │
│  │  - Printer support                     │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │  Reports Dashboard (HTML/CSS/JS)       │ │
│  │  - Filter & search                     │ │
│  │  - Export to CSV                       │ │
│  └────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │ HTTP/AJAX
┌──────────────────▼──────────────────────────┐
│    NODE.JS/EXPRESS BACKEND (server.js)      │
│  ┌────────────────────────────────────────┐ │
│  │  Routes & Controllers                  │ │
│  │  - /api/bills/*  endpoints             │ │
│  │  - /api/reports/* endpoints            │ │
│  │  - Static file serving                 │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │  Middleware                            │ │
│  │  - Express, CORS, Helmet, BodyParser   │ │
│  │  - Connection pooling                  │ │
│  └────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │ MySQL Protocol
┌──────────────────▼──────────────────────────┐
│      MYSQL DATABASE (powerbill_db)          │
│  ┌────────────────────────────────────────┐ │
│  │  bills table                           │ │
│  │  - 15 columns, optimized indexes       │ │
│  │  - Sample data included                │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │  Views                                 │ │
│  │  - monthly_billing_summary             │ │
│  │  - consumer_billing_history            │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

           BROWSER LOCALSTORAGE (Backup)
           - Fallback when server unavailable
           - Up to 5MB storage
```

---

## File Reference

### Frontend Files

#### `billing_calculator.html` (240 lines)
- Main calculator interface
- Form inputs for consumer details
- Meter readings section
- Tariff configuration
- Bill summary display
- Navbar with navigation
- Links to reports page

**Key Elements:**
```html
- Consumer ID, Name, Meter Type inputs
- Previous & Current Reading inputs
- Units Consumed (auto-calculated)
- Rate per Unit, Fixed Charge inputs
- GST & Additional Charges inputs
- Calculate & Save buttons
- Bill Summary display area
- Status message area
```

#### `billing_calculator.js` (350 lines)
- BillCalculator class
- Event listeners setup
- Calculation logic
- Database save functionality
- LocalStorage backup
- Professional printing
- Form validation

**Key Methods:**
```javascript
calculateUnits()           // Auto-calculate units
calculateBill()           // Calculate total bill
displayBillSummary()      // Show summary
saveBill()                // Save to database
saveToLocalStorage()      // Backup locally
printBill()               // Generate invoice
validateForm()            // Validate inputs
showStatus()              // Display messages
```

#### `billing_reports.html` (220 lines)
- Reports dashboard
- Filter controls
- Summary statistics cards
- Bills table with pagination
- Delete confirmation modal
- Navbar with navigation

**Key Elements:**
```html
- Filter inputs (Consumer ID, Name, Type, Date)
- Statistics cards (Total Bills, Amount, Units, Average)
- Responsive bills table
- Pagination controls
- Export to CSV button
- Delete confirmation modal
```

#### `billing_reports.js` (400 lines)
- BillingReports class
- Data loading (server/LocalStorage)
- Filtering logic
- Pagination logic
- Statistics calculation
- CSV export
- Delete functionality

**Key Methods:**
```javascript
loadBills()               // Load from server
loadFromLocalStorage()    // Fallback load
applyFilters()           // Apply all filters
displayBills()           // Show paginated list
updateStatistics()       // Calculate stats
exportToCSV()            // Generate CSV
viewBill()               // Show details
deleteBill()             // Delete record
```

#### `billing_calculator.css` (180 lines)
- Professional styling
- Responsive layout
- Print styles
- Animations
- Color scheme

#### `power.html` (70 lines - updated)
- Main landing page
- Links to calculator & reports
- Plans section
- Font Awesome icons added
- Navigation menu

---

### Backend Files

#### `server.js` (320 lines)
Node.js Express server with:

**Key Components:**
```javascript
// Setup
- Express app initialization
- Middleware configuration
- Static file serving

// Routes
- POST   /api/bills/save
- GET    /api/bills/all
- GET    /api/bills/:id
- GET    /api/bills/consumer/:id
- PUT    /api/bills/:id
- DELETE /api/bills/:id
- GET    /api/reports/summary
- GET    /api/reports/monthly

// Database
- MySQL connection pool
- Query execution
- Error handling
```

**Connection Pool Config:**
```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'powerbill_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

---

### Configuration Files

#### `package.json`
```json
{
  "name": "powerbill-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "helmet": "^7.0.0"
  }
}
```

#### `.env` (Template)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=powerbill_db
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

#### `database_setup.sql`
```sql
-- Creates powerbill_db database
-- Creates bills table with indexes
-- Creates monthly_billing_summary view
-- Creates consumer_billing_history view
-- Inserts 3 sample bills
```

---

## Database Reference

### Bills Table Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT AUTO_INCREMENT | Unique bill ID |
| `consumer_id` | VARCHAR(50) | Consumer identifier |
| `consumer_name` | VARCHAR(100) | Full name |
| `meter_type` | ENUM | domestic/commercial/industrial |
| `units_consumed` | DECIMAL(10,2) | kWh consumed |
| `rate_per_unit` | DECIMAL(10,2) | ₹/kWh rate |
| `fixed_charge` | DECIMAL(10,2) | Monthly fixed charge |
| `additional_charges` | DECIMAL(10,2) | Extra charges |
| `energy_charge` | DECIMAL(12,2) | Units × Rate |
| `subtotal` | DECIMAL(12,2) | Before tax |
| `gst_percentage` | DECIMAL(5,2) | Tax percentage |
| `gst_amount` | DECIMAL(12,2) | Calculated tax |
| `total_bill` | DECIMAL(12,2) | Final amount due |
| `billing_date` | DATE | Bill date |
| `payment_status` | ENUM | pending/paid/overdue |
| `created_at` | TIMESTAMP | Record creation |
| `updated_at` | TIMESTAMP | Last update |

### Indexes
```sql
INDEX idx_consumer_id (consumer_id)
INDEX idx_billing_date (billing_date)
INDEX idx_meter_type (meter_type)
INDEX idx_created_at (created_at)
```

### Views

**monthly_billing_summary**
```sql
SELECT 
  DATE_FORMAT(billing_date, '%Y-%m') as month,
  meter_type,
  COUNT(*) as bills_count,
  SUM(units_consumed) as total_units,
  SUM(energy_charge) as total_energy_charge,
  SUM(gst_amount) as total_gst,
  SUM(total_bill) as total_amount,
  AVG(total_bill) as average_bill,
  MIN(total_bill) as min_bill,
  MAX(total_bill) as max_bill
```

**consumer_billing_history**
```sql
SELECT 
  consumer_id,
  consumer_name,
  meter_type,
  COUNT(*) as total_bills,
  SUM(units_consumed) as total_units,
  SUM(total_bill) as total_paid,
  AVG(total_bill) as average_bill,
  MAX(billing_date) as last_billing_date,
  MIN(billing_date) as first_billing_date
```

---

## API Reference

### Bill Endpoints

#### Save Bill
```http
POST /api/bills/save
Content-Type: application/json

{
  "consumerId": "PWR-001",
  "consumerName": "John Doe",
  "meterType": "domestic",
  "unitsConsumed": 150.50,
  "ratePerUnit": 6.50,
  "fixedCharge": 100,
  "additionalCharges": 0,
  "energyCharge": 978.25,
  "subtotal": 1078.25,
  "gstPercentage": 5,
  "gstAmount": 53.91,
  "totalBill": 1132.16,
  "billingDate": "2026-05-26"
}

Response: { "success": true, "billId": 1, "message": "..." }
```

#### Get All Bills
```http
GET /api/bills/all

Response: [
  { id: 1, consumer_id: "PWR-001", ... },
  { id: 2, consumer_id: "PWR-002", ... }
]
```

#### Get Bill by ID
```http
GET /api/bills/1

Response: { id: 1, consumer_id: "PWR-001", ... }
```

#### Get Consumer Bills
```http
GET /api/bills/consumer/PWR-001

Response: [ { ...bills for consumer... } ]
```

#### Update Bill
```http
PUT /api/bills/1
Content-Type: application/json

{
  "totalBill": 1150.00,
  "gstAmount": 57.50,
  "additionalCharges": 20
}
```

#### Delete Bill
```http
DELETE /api/bills/1

Response: { "success": true, "message": "..." }
```

### Report Endpoints

#### Summary Report
```http
GET /api/reports/summary

Response: {
  "total_bills": 150,
  "total_units": 22500,
  "total_amount": 156000,
  "average_bill": 1040,
  "min_bill": 500,
  "max_bill": 3000
}
```

#### Monthly Report
```http
GET /api/reports/monthly

Response: [
  {
    "month": "2026-05",
    "bills_count": 50,
    "total_units": 7500,
    "total_amount": 52000,
    "average_bill": 1040
  },
  { ... }
]
```

---

## Code Examples

### Example 1: Calculate and Save a Bill

**Frontend:**
```javascript
// Get form values
const consumerId = document.getElementById('consumerId').value;
const unitsConsumed = parseFloat(document.getElementById('unitsConsumed').value);
const ratePerUnit = parseFloat(document.getElementById('ratePerUnit').value);

// Calculate
const energyCharge = unitsConsumed * ratePerUnit;
const subtotal = energyCharge + fixedCharge + additionalCharges;
const gstAmount = (subtotal * gst) / 100;
const totalBill = subtotal + gstAmount;

// Save
const billData = {
  consumerId,
  unitsConsumed,
  ratePerUnit,
  totalBill,
  // ... other fields
};

fetch('/api/bills/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(billData)
})
.then(response => response.json())
.then(data => console.log('Bill saved:', data.billId));
```

### Example 2: Filter and Display Bills

**Frontend:**
```javascript
const consumerId = document.getElementById('filterConsumerId').value;
const meterType = document.getElementById('filterMeterType').value;

const filteredBills = allBills.filter(bill => {
  return (!consumerId || bill.consumerId.includes(consumerId)) &&
         (!meterType || bill.meterType === meterType);
});

displayBills(filteredBills);
```

### Example 3: Export to CSV

**Frontend:**
```javascript
let csv = 'Consumer ID,Name,Total Bill,Date\n';

bills.forEach(bill => {
  csv += `"${bill.consumerId}","${bill.consumerName}",${bill.totalBill},"${bill.billingDate}"\n`;
});

const blob = new Blob([csv], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'bills.csv';
a.click();
```

### Example 4: Backend Query

**Backend:**
```javascript
const query = `
  SELECT * FROM bills 
  WHERE consumer_id = ? 
  AND billing_date >= ? 
  ORDER BY created_at DESC
`;

const [rows] = await connection.execute(query, [consumerId, startDate]);
```

---

## Common Tasks

### Task 1: Add a New Bill

1. Open `/billing_calculator.html`
2. Fill form with consumer details
3. Enter meter readings
4. Set rates and charges
5. Click "Calculate Bill"
6. Click "Save to Database"

### Task 2: View Billing History

1. Open `/billing_reports.html`
2. Apply filters if needed
3. Review statistics
4. Click View/Edit/Delete as needed

### Task 3: Export Data

1. Open `/billing_reports.html`
2. Apply desired filters
3. Click "Export to CSV"
4. File downloads automatically

### Task 4: Debug Issues

1. Check browser console (F12)
2. Check server logs
3. Verify database connectivity
4. Check .env configuration

### Task 5: Backup Database

```bash
# Backup
mysqldump -u root -p powerbill_db > backup.sql

# Restore
mysql -u root -p powerbill_db < backup.sql
```

---

## Performance Tips

### Database Optimization
```sql
-- Add missing indexes
ALTER TABLE bills ADD INDEX idx_date (billing_date);
ALTER TABLE bills ADD INDEX idx_consumer (consumer_id);

-- Monitor slow queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### Node.js Optimization
```bash
# Increase memory limit
node --max-old-space-size=2048 server.js

# Enable clustering
npm install cluster
```

### Frontend Optimization
```javascript
// Lazy load reports
const reports = lazy(() => import('./billing_reports.js'));

// Minimize DOM manipulation
const batch = document.createDocumentFragment();
items.forEach(item => batch.appendChild(createItem(item)));
container.appendChild(batch);

// Debounce filters
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

### Caching Strategy
```javascript
// Cache bills in memory
const billCache = new Map();

function getCachedBill(id) {
  if (billCache.has(id)) return billCache.get(id);
  const bill = fetchFromDB(id);
  billCache.set(id, bill);
  return bill;
}
```

---

## Troubleshooting Reference

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL not running | `net start MySQL80` |
| `Unknown database 'powerbill_db'` | DB not created | `mysql -u root -p < database_setup.sql` |
| `EADDRINUSE :::3000` | Port in use | Change PORT in .env |
| `Module not found` | Dependencies missing | `npm install` |
| `Cannot GET /api/bills/all` | Server not running | `npm run dev` |

---

## Resources

- **Node.js:** https://nodejs.org/docs/
- **Express:** https://expressjs.com/
- **MySQL:** https://dev.mysql.com/doc/
- **Bootstrap:** https://getbootstrap.com/docs/

---

**Last Updated:** May 26, 2026  
**Version:** 1.0.0
