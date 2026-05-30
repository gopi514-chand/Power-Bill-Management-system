-- PowerBill Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS powerbill_db;
USE powerbill_db;

-- Drop existing table if exists (for fresh setup)
DROP TABLE IF EXISTS bills;

-- Bills Table
CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consumer_id VARCHAR(50) NOT NULL,
  consumer_name VARCHAR(100) NOT NULL,
  meter_type ENUM('domestic', 'commercial', 'industrial') NOT NULL,
  units_consumed DECIMAL(10, 2) NOT NULL,
  rate_per_unit DECIMAL(10, 2) NOT NULL,
  fixed_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  additional_charges DECIMAL(10, 2) NOT NULL DEFAULT 0,
  energy_charge DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  gst_percentage DECIMAL(5, 2) NOT NULL DEFAULT 5,
  gst_amount DECIMAL(12, 2) NOT NULL,
  total_bill DECIMAL(12, 2) NOT NULL,
  billing_date DATE NOT NULL,
  payment_status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for faster queries
  INDEX idx_consumer_id (consumer_id),
  INDEX idx_billing_date (billing_date),
  INDEX idx_meter_type (meter_type),
  INDEX idx_created_at (created_at)
);

-- Create a view for monthly summaries
CREATE VIEW monthly_billing_summary AS
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
FROM bills
GROUP BY DATE_FORMAT(billing_date, '%Y-%m'), meter_type;

-- Create a view for consumer history
CREATE VIEW consumer_billing_history AS
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
FROM bills
GROUP BY consumer_id, consumer_name, meter_type;

-- Sample data (optional)
INSERT INTO bills 
(consumer_id, consumer_name, meter_type, units_consumed, rate_per_unit, fixed_charge, 
 additional_charges, energy_charge, subtotal, gst_percentage, gst_amount, total_bill, billing_date)
VALUES
('PWR-001', 'John Doe', 'domestic', 150.50, 6.50, 100, 0, 978.25, 1078.25, 5, 53.91, 1132.16, '2026-05-01'),
('PWR-002', 'Jane Smith', 'commercial', 500.00, 7.50, 200, 50, 3750.00, 4000.00, 5, 200.00, 4200.00, '2026-05-01'),
('PWR-003', 'ABC Industries', 'industrial', 2000.00, 8.00, 500, 100, 16000.00, 16600.00, 5, 830.00, 17430.00, '2026-05-02');
