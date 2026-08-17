# ⚡ PowerBill – Electricity Bill Management System

### 🧾 Calculate • Manage • Analyze • Export Electricity Bills

**PowerBill** is a full-stack electricity bill management web application that allows users to **calculate electricity bills, store billing records, manage consumer history, generate reports, and export billing data**.

The application combines a responsive **Bootstrap 5 frontend**, **Node.js/Express backend**, and **MySQL database** to provide a complete billing management solution.

> 💡 Built as a practical web application for managing electricity consumption, billing calculations, consumer records, and billing reports.

---

## 🌐 Live Demo

🚀 **Try PowerBill Online**

👉 **https://gopi514-chand.github.io/Power-Bill-Management-system/**

---

## 📸 Project Highlights

|             ⚡ Bill Calculator             |         📊 Billing Reports         |         🗄️ Database        |
| :---------------------------------------: | :--------------------------------: | :-------------------------: |
| Calculate electricity bills automatically | Analyze and filter billing records | Store billing data securely |

|           🧮 Auto Calculation           |        📥 CSV Export        |        📱 Responsive UI       |
| :-------------------------------------: | :-------------------------: | :---------------------------: |
| Units, tax & total calculated instantly | Export reports for analysis | Works across desktop & mobile |

---

# ✨ Features

## ⚡ Smart Bill Calculator

Calculate electricity bills quickly using meter readings and tariff information.

### Features include:

* 🔢 Automatic unit consumption calculation
* 💰 Energy charge calculation
* 🧾 Fixed charge calculation
* ➕ Additional charge support
* 🧮 GST calculation
* 💵 Automatic total bill calculation
* 💾 Save bills to database
* 🖨️ Professional bill printing

### Calculation Flow

```text
Current Meter Reading
          -
Previous Meter Reading
          ↓
    Units Consumed
          ↓
 Units × Rate per Unit
          ↓
     Energy Charge
          +
      Fixed Charge
          +
   Additional Charges
          ↓
       Subtotal
          ↓
        + GST
          ↓
     Total Bill
```

---

# 📊 Billing Reports & Analytics

PowerBill provides a dedicated reporting interface for viewing and managing billing records.

### 🔍 Search & Filters

Users can filter billing records using:

* Consumer ID
* Consumer Name
* Meter Type
* Billing Date
* Date Range

### 📈 Dashboard Statistics

The reporting section provides:

* 📄 Total number of bills
* 💰 Total amount billed
* ⚡ Total units consumed
* 📊 Average bill amount
* 📅 Monthly billing summaries
* 🏠 Meter-type based summaries

---

# 🗄️ Database Management

PowerBill uses **MySQL** for persistent billing data storage.

### Database capabilities:

* Consumer billing records
* Monthly billing summaries
* Consumer billing history
* Payment status tracking
* Bill creation timestamps
* Bill update timestamps

### 💾 Data Persistence Strategy

```text
                 PowerBill
                     │
                     ▼
              Node.js / Express
                     │
             ┌───────┴───────┐
             ▼               ▼
        MySQL Database    LocalStorage
          Primary           Backup
             │               │
             └───────┬───────┘
                     ▼
               Billing Data
```

**Primary Storage:** MySQL
**Backup Storage:** Browser LocalStorage

If the backend/database is unavailable, the application can fall back to browser LocalStorage for temporary data storage.

---

# 📥 Export Billing Data

Users can export billing records as a CSV file for further analysis.

### Export Process

```text
Billing Reports
      ↓
Apply Filters
      ↓
Review Records
      ↓
Export to CSV
      ↓
billing-report-YYYY-MM-DD.csv
```

The exported CSV file can be opened using applications such as **Microsoft Excel** or **Google Sheets**.

---

# 🖨️ Professional Bill Printing

PowerBill provides a print-friendly billing format that allows users to generate a professional-looking electricity bill.

The printed bill can include:

* Consumer information
* Meter type
* Previous reading
* Current reading
* Units consumed
* Energy charges
* Fixed charges
* Additional charges
* GST
* Total amount
* Billing date
* Payment status

---

# 🛠️ Technology Stack

| Technology          | Usage                  |
| ------------------- | ---------------------- |
| 🌐 **HTML5**        | Web page structure     |
| 🎨 **CSS3**         | Custom styling         |
| 🅱️ **Bootstrap 5** | Responsive UI          |
| ⚡ **JavaScript**    | Frontend functionality |
| 🟢 **Node.js**      | Backend runtime        |
| 🚂 **Express.js**   | REST API & server      |
| 🗄️ **MySQL**       | Persistent database    |
| 💾 **LocalStorage** | Browser-side backup    |
| 📄 **CSV**          | Billing report export  |
| 📦 **npm**          | Dependency management  |

---

# 🏗️ System Architecture

PowerBill follows a simple full-stack architecture:

```text
┌─────────────────────────────────────┐
│             USER / CLIENT           │
│                                     │
│  Bill Calculator │ Billing Reports │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          FRONTEND LAYER             │
│                                     │
│ HTML │ CSS │ Bootstrap │ JavaScript │
└──────────────────┬──────────────────┘
                   │
                   │ HTTP / REST API
                   ▼
┌─────────────────────────────────────┐
│          BACKEND LAYER              │
│                                     │
│        Node.js + Express.js         │
│                                     │
│  Bill APIs │ Report APIs │ CRUD     │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│           DATABASE LAYER             │
│                                     │
│             MySQL                   │
│                                     │
│  Bills │ Consumers │ Reports        │
└─────────────────────────────────────┘
```

---

# 🔄 End-to-End Application Flow

```text
User Opens PowerBill
        ↓
Bill Calculator
        ↓
Enter Consumer Details
        ↓
Enter Meter Readings
        ↓
Units Automatically Calculated
        ↓
Enter Tariff Information
        ↓
Calculate Energy Charges
        ↓
Apply Fixed & Additional Charges
        ↓
Calculate GST
        ↓
Generate Final Bill
        ↓
Save Bill
        ↓
Node.js / Express API
        ↓
MySQL Database
        ↓
Billing Reports
        ↓
Filter / View / Export / Print
```

---

# 🧮 Bill Calculation Logic

The application calculates the electricity bill using the following logic:

### 1️⃣ Units Consumed

```text
Units Consumed =
Current Reading - Previous Reading
```

### 2️⃣ Energy Charge

```text
Energy Charge =
Units Consumed × Rate Per Unit
```

### 3️⃣ Subtotal

```text
Subtotal =
Energy Charge
+ Fixed Charge
+ Additional Charges
```

### 4️⃣ GST

```text
GST Amount =
Subtotal × GST Percentage / 100
```

### 5️⃣ Final Bill

```text
Total Bill =
Subtotal + GST Amount
```

---

# 🔌 REST API

The backend provides REST APIs for bill management and reporting.

## Bill APIs

| Method   | Endpoint                  | Description                       |
| -------- | ------------------------- | --------------------------------- |
| `POST`   | `/api/bills/save`         | Save a new bill                   |
| `GET`    | `/api/bills/all`          | Retrieve all bills                |
| `GET`    | `/api/bills/:id`          | Retrieve a specific bill          |
| `GET`    | `/api/bills/consumer/:id` | Retrieve consumer billing history |
| `PUT`    | `/api/bills/:id`          | Update a bill                     |
| `DELETE` | `/api/bills/:id`          | Delete a bill                     |

## Report APIs

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| `GET`  | `/api/reports/summary` | Retrieve billing summary      |
| `GET`  | `/api/reports/monthly` | Retrieve monthly billing data |

---

# 🗃️ Database Schema

The main database table is `bills`.

### Bills Table

| Column               | Description                        |
| -------------------- | ---------------------------------- |
| `id`                 | Auto-increment bill ID             |
| `consumer_id`        | Unique consumer identifier         |
| `consumer_name`      | Consumer name                      |
| `meter_type`         | Domestic / Commercial / Industrial |
| `units_consumed`     | Electricity consumption in kWh     |
| `rate_per_unit`      | Electricity tariff                 |
| `fixed_charge`       | Monthly fixed charge               |
| `additional_charges` | Additional charges                 |
| `energy_charge`      | Energy consumption charge          |
| `subtotal`           | Pre-tax amount                     |
| `gst_percentage`     | GST percentage                     |
| `gst_amount`         | Calculated GST                     |
| `total_bill`         | Final bill amount                  |
| `billing_date`       | Bill generation date               |
| `payment_status`     | Pending / Paid / Overdue           |
| `created_at`         | Record creation time               |
| `updated_at`         | Last update time                   |

---

# 📁 Project Structure

```text
Power-Bill-Management-system/
│
├── billing_calculator.html
├── billing_calculator.js
├── billing_calculator.css
│
├── billing_reports.html
├── billing_reports.js
│
├── server.js
├── database_setup.sql
├── package.json
├── .env.example
│
└── README.md
```

---

# 🚀 Installation & Setup

## Prerequisites

Make sure the following are installed:

* **Node.js v14+**
* **npm**
* **MySQL Server v5.7+**
* **MySQL Workbench** *(optional)*

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/gopi514-chand/Power-Bill-Management-system.git
```

Navigate to the project:

```bash
cd Power-Bill-Management-system
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure MySQL

Create the database using:

```bash
mysql -u root -p < database_setup.sql
```

Or execute the SQL script through MySQL Workbench.

Verify the database:

```sql
USE powerbill_db;

SELECT * FROM bills;
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file based on `.env.example`.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=powerbill_db
PORT=3000
```

> ⚠️ Never commit your `.env` file to GitHub.

---

## 5️⃣ Start the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The backend will normally run at:

```text
http://localhost:3000
```

---

# 📖 How to Use

## ⚡ Calculate a Bill

1. Open the **Bill Calculator**.
2. Enter the Consumer ID.
3. Enter the Consumer Name.
4. Select the Meter Type.
5. Enter the Previous Meter Reading.
6. Enter the Current Meter Reading.
7. Enter the Rate Per Unit.
8. Enter Fixed Charges.
9. Enter GST percentage.
10. Add additional charges if required.
11. Click **Calculate Bill**.
12. Review the generated bill.
13. Click **Save to Database**.

---

## 📊 View Billing Reports

1. Open **Billing Reports**.
2. Search using Consumer ID or Name.
3. Filter by Meter Type.
4. Select a Date Range.
5. Review summary statistics.
6. View detailed bill information.
7. Export billing data to CSV.
8. Delete outdated records if required.

---

# 📊 Sample Data

The project includes sample billing records such as:

| Consumer                 | Meter Type | Example Bill |
| ------------------------ | ---------- | -----------: |
| PWR-001 – John Doe       | Domestic   |    ₹1,132.16 |
| PWR-002 – Jane Smith     | Commercial |    ₹4,200.00 |
| PWR-003 – ABC Industries | Industrial |   ₹17,430.00 |

---

# 📱 Responsive Design

The application uses **Bootstrap 5** to provide a responsive interface.

It is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The interface focuses on simplicity, readability, and easy navigation.

---

# 🔐 Security Considerations

For production deployment, the following security practices should be implemented:

* 🔒 Use HTTPS
* 🔑 Implement user authentication
* 🛡️ Validate server-side inputs
* 🧹 Sanitize database inputs
* 🔐 Store credentials using environment variables
* 🚫 Never expose database credentials
* 🚫 Never commit `.env` to GitHub
* 👤 Implement role-based access control
* 🔍 Add proper API authorization

---

# ⚠️ Troubleshooting

## MySQL Connection Error

```text
Error: connect ECONNREFUSED 127.0.0.1:3306
```

Make sure MySQL is running.

### Windows

```bash
net start MySQL80
```

### macOS

```bash
brew services start mysql
```

### Linux

```bash
sudo systemctl start mysql
```

---

## Database Not Found

```text
Error: Unknown database 'powerbill_db'
```

Run:

```bash
mysql -u root -p < database_setup.sql
```

---

## Port 3000 Already in Use

### Windows

```bash
netstat -ano | findstr :3000
```

### macOS / Linux

```bash
lsof -i :3000
```

You can change the port using the `.env` file:

```env
PORT=3001
```

---

# 🚀 Future Enhancements

The project can be extended with:

* 🔐 User authentication and authorization
* 💳 Online payment gateway
* 📧 Email bill notifications
* 📱 SMS notifications
* 📊 Consumption analytics dashboard
* 📈 Interactive charts
* 🧾 Custom invoice templates
* 🌍 Multi-language support
* 📱 React Native mobile application
* ☁️ Cloud database integration
* 👥 Admin and consumer dashboards
* 🔔 Automated payment reminders

---

# 🎯 What I Learned

This project provided hands-on experience in:

* Frontend web development
* Responsive UI development
* JavaScript-based application logic
* REST API development
* Node.js and Express.js
* MySQL database integration
* CRUD operations
* Database-driven applications
* LocalStorage fallback mechanisms
* Data filtering and pagination
* CSV data export
* Bill calculation logic
* Print-friendly web pages
* Environment configuration
* Full-stack application architecture

---

# 📌 Project Highlights for Recruiters

### 💻 Frontend

Built a responsive billing interface using **HTML, CSS, JavaScript, and Bootstrap 5**.

### ⚙️ Backend

Implemented REST APIs using **Node.js and Express.js** for bill management and reporting.

### 🗄️ Database

Integrated **MySQL** for persistent storage of consumer and billing information.

### 📊 Reporting

Implemented filtering, pagination, statistics, consumer history, and CSV export functionality.

### 💾 Reliability

Added **LocalStorage fallback** to maintain temporary billing data when the backend is unavailable.

---

# 📈 Project Version

### `v1.0.0` – Initial Release

**Released:** May 2026

### Included:

* ⚡ Electricity bill calculator
* 🗄️ MySQL database integration
* 📊 Billing reports
* 📥 CSV export
* 🖨️ Bill printing
* 💾 LocalStorage backup
* 📱 Responsive Bootstrap interface

---

<img width="3194" height="8310" alt="diagram (2)" src="https://github.com/user-attachments/assets/f5b1be47-015b-43ac-ad63-b52900a9f5b3" />






# 👨‍💻 Author

## **Gopi Chand**

Computer Science Engineering Graduate | Software Developer

🔗 **Live Project:**
https://gopi514-chand.github.io/Power-Bill-Management-system/

---

# ⭐ Support

If you find **PowerBill** useful or interesting, consider giving the repository a ⭐ on GitHub.

Your feedback and suggestions are always welcome!

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute the project according to the terms of the license.

---

### ⚡ PowerBill

**A simple, practical, and scalable solution for electricity bill calculation and management.**
