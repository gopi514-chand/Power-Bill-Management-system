// Environment Configuration
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mysql = require('mysql2/promise');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Static files
app.use(express.static(path.join(__dirname)));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'powerbill_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'billing_calculator.html'));
});

// API: Save Bill
app.post('/api/bills/save', async (req, res) => {
  try {
    const {
      consumerId,
      consumerName,
      meterType,
      unitsConsumed,
      ratePerUnit,
      fixedCharge,
      additionalCharges,
      energyCharge,
      subtotal,
      gstPercentage,
      gstAmount,
      totalBill,
      billingDate,
    } = req.body;

    const connection = await pool.getConnection();

    const query = `
      INSERT INTO bills 
      (consumer_id, consumer_name, meter_type, units_consumed, rate_per_unit, 
       fixed_charge, additional_charges, energy_charge, subtotal, gst_percentage, 
       gst_amount, total_bill, billing_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await connection.execute(query, [
      consumerId,
      consumerName,
      meterType,
      unitsConsumed,
      ratePerUnit,
      fixedCharge,
      additionalCharges,
      energyCharge,
      subtotal,
      gstPercentage,
      gstAmount,
      totalBill,
      billingDate,
    ]);

    connection.release();

    res.status(201).json({
      success: true,
      billId: result.insertId,
      message: 'Bill saved successfully',
    });
  } catch (error) {
    console.error('Error saving bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving bill',
      error: error.message,
    });
  }
});

// API: Get All Bills
app.get('/api/bills/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT * FROM bills ORDER BY created_at DESC LIMIT 500
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bills',
      error: error.message,
    });
  }
});

// API: Get Bill by ID
app.get('/api/bills/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const query = 'SELECT * FROM bills WHERE id = ?';
    const [rows] = await connection.execute(query, [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill',
      error: error.message,
    });
  }
});

// API: Get Bills by Consumer ID
app.get('/api/bills/consumer/:consumerId', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const query = 'SELECT * FROM bills WHERE consumer_id = ? ORDER BY created_at DESC';
    const [rows] = await connection.execute(query, [req.params.consumerId]);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bills',
      error: error.message,
    });
  }
});

// API: Update Bill
app.put('/api/bills/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const {
      totalBill,
      gstAmount,
      additionalCharges,
    } = req.body;

    const query = `
      UPDATE bills 
      SET total_bill = ?, gst_amount = ?, additional_charges = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [
      totalBill,
      gstAmount,
      additionalCharges,
      req.params.id,
    ]);

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    res.json({
      success: true,
      message: 'Bill updated successfully',
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bill',
      error: error.message,
    });
  }
});

// API: Delete Bill
app.delete('/api/bills/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const query = 'DELETE FROM bills WHERE id = ?';
    const [result] = await connection.execute(query, [req.params.id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    res.json({
      success: true,
      message: 'Bill deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bill',
      error: error.message,
    });
  }
});

// API: Get Billing Summary Report
app.get('/api/reports/summary', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT 
        COUNT(*) as total_bills,
        SUM(units_consumed) as total_units,
        SUM(total_bill) as total_amount,
        AVG(total_bill) as average_bill,
        MIN(total_bill) as min_bill,
        MAX(total_bill) as max_bill
      FROM bills
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching summary',
      error: error.message,
    });
  }
});

// API: Get Monthly Report
app.get('/api/reports/monthly', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT 
        DATE_FORMAT(billing_date, '%Y-%m') as month,
        COUNT(*) as bills_count,
        SUM(units_consumed) as total_units,
        SUM(total_bill) as total_amount,
        AVG(total_bill) as average_bill
      FROM bills
      GROUP BY DATE_FORMAT(billing_date, '%Y-%m')
      ORDER BY month DESC
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly report',
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ PowerBill Server running on http://localhost:${PORT}`);
});
