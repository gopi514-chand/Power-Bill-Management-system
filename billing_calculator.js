// Bill Calculator JavaScript
class BillCalculator {
  constructor() {
    this.currentBill = null;
    this.initializeEventListeners();
    this.loadFormFromLocalStorage();
  }

  initializeEventListeners() {
    const inputFields = [
      'consumerId',
      'consumerName',
      'meterType',
      'prevReading',
      'currReading',
      'ratePerUnit',
      'fixedCharge',
      'gst',
      'additionalCharges',
    ];

    inputFields.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      element.addEventListener('change', () => {
        if (id === 'prevReading' || id === 'currReading') {
          this.calculateUnits();
        }
        this.saveFormToLocalStorage();
      });

      element.addEventListener('input', () => this.saveFormToLocalStorage());
    });

    // Calculate bill
    document.getElementById('calculateBtn').addEventListener('click', () => this.calculateBill());

    // Save to database
    document.getElementById('saveBtn').addEventListener('click', () => this.saveBill());

    // Print bill
    document.getElementById('printBtn').addEventListener('click', () => this.printBill());
  }

  calculateUnits() {
    const prevReading = parseFloat(document.getElementById('prevReading').value) || 0;
    const currReading = parseFloat(document.getElementById('currReading').value) || 0;
    
    const units = Math.max(0, currReading - prevReading);
    document.getElementById('unitsConsumed').value = units.toFixed(2);
  }

  calculateBill() {
    // Validate form
    if (!this.validateForm()) {
      this.showStatus('Please fill all required fields', 'danger');
      return;
    }

    // Get input values
    const consumerId = document.getElementById('consumerId').value;
    const consumerName = document.getElementById('consumerName').value;
    const meterType = document.getElementById('meterType').value;
    const unitsConsumed = parseFloat(document.getElementById('unitsConsumed').value);
    const ratePerUnit = parseFloat(document.getElementById('ratePerUnit').value);
    const fixedCharge = parseFloat(document.getElementById('fixedCharge').value);
    const gst = parseFloat(document.getElementById('gst').value);
    const additionalCharges = parseFloat(document.getElementById('additionalCharges').value) || 0;

    // Perform calculations
    const energyCharge = unitsConsumed * ratePerUnit;
    const subtotal = energyCharge + fixedCharge + additionalCharges;
    const gstAmount = (subtotal * gst) / 100;
    const totalBill = subtotal + gstAmount;

    // Store bill data
    this.currentBill = {
      consumerId,
      consumerName,
      meterType,
      unitsConsumed,
      ratePerUnit,
      fixedCharge,
      additionalCharges,
      energyCharge,
      subtotal,
      gstPercentage: gst,
      gstAmount,
      totalBill,
      billingDate: new Date().toISOString().split('T')[0],
      billingTime: new Date().toLocaleTimeString(),
    };

    // Display bill summary
    this.displayBillSummary();
  }

  displayBillSummary() {
    const bill = this.currentBill;
    const summaryDiv = document.getElementById('billSummary');

    let html = `
      <div class="summary-item">
        <label>Consumer ID:</label>
        <span class="value">${bill.consumerId}</span>
      </div>
      <div class="summary-item">
        <label>Consumer Name:</label>
        <span class="value">${bill.consumerName}</span>
      </div>
      <div class="summary-item">
        <label>Meter Type:</label>
        <span class="value">${this.capitalize(bill.meterType)}</span>
      </div>
      <div class="summary-item">
        <label>Billing Date:</label>
        <span class="value">${bill.billingDate}</span>
      </div>

      <hr>

      <div class="summary-item">
        <label>Units Consumed (kWh):</label>
        <span class="value">${bill.unitsConsumed.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <label>Rate per Unit (₹/kWh):</label>
        <span class="value">₹${bill.ratePerUnit.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <label>Energy Charge:</label>
        <span class="value">₹${bill.energyCharge.toFixed(2)}</span>
      </div>

      <hr>

      <div class="summary-item">
        <label>Fixed Charge:</label>
        <span class="value">₹${bill.fixedCharge.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <label>Additional Charges:</label>
        <span class="value">₹${bill.additionalCharges.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <label>Subtotal:</label>
        <span class="value">₹${bill.subtotal.toFixed(2)}</span>
      </div>

      <hr>

      <div class="summary-item">
        <label>GST (${bill.gstPercentage}%):</label>
        <span class="value">₹${bill.gstAmount.toFixed(2)}</span>
      </div>

      <div class="summary-total">
        <label>Total Bill Amount:</label>
        <span class="value">₹${bill.totalBill.toFixed(2)}</span>
      </div>
    `;

    summaryDiv.innerHTML = html;
    document.getElementById('summaryCard').classList.remove('hidden-card');
    this.showStatus('Bill calculated successfully!', 'success');
  }

  saveBill() {
    if (!this.currentBill) {
      this.showStatus('Please calculate a bill first', 'danger');
      return;
    }

    // Show loading state
    const btn = document.getElementById('saveBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Saving...';
    btn.disabled = true;

    // Send data to server
    fetch('/api/bills/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.currentBill),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        this.showStatus(`✓ Bill saved successfully! Bill ID: ${data.billId}`, 'success');
        // Store bill locally as backup
        this.saveToLocalStorage();
      })
      .catch(error => {
        console.error('Error:', error);
        this.showStatus('Server not available. Saving locally...', 'warning');
        this.saveToLocalStorage();
      })
      .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      });
  }

  saveToLocalStorage() {
    try {
      const bills = JSON.parse(localStorage.getItem('powerBills')) || [];
      this.currentBill.id = Date.now(); // Add unique ID
      bills.push(this.currentBill);
      localStorage.setItem('powerBills', JSON.stringify(bills));
      this.showStatus('✓ Bill saved to local storage!', 'success');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      this.showStatus('Error saving bill', 'danger');
    }
  }

  getFormValues() {
    return {
      consumerId: document.getElementById('consumerId').value,
      consumerName: document.getElementById('consumerName').value,
      meterType: document.getElementById('meterType').value,
      prevReading: document.getElementById('prevReading').value,
      currReading: document.getElementById('currReading').value,
      unitsConsumed: document.getElementById('unitsConsumed').value,
      ratePerUnit: document.getElementById('ratePerUnit').value,
      fixedCharge: document.getElementById('fixedCharge').value,
      gst: document.getElementById('gst').value,
      additionalCharges: document.getElementById('additionalCharges').value,
    };
  }

  setFormValues(values) {
    Object.entries(values).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element && value !== undefined && value !== null) {
        element.value = value;
      }
    });
    this.calculateUnits();
  }

  saveFormToLocalStorage() {
    try {
      const formData = this.getFormValues();
      localStorage.setItem('powerBillFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  }

  loadFormFromLocalStorage() {
    try {
      const saved = localStorage.getItem('powerBillFormData');
      if (!saved) return;
      const formData = JSON.parse(saved);
      this.setFormValues(formData);
      this.showStatus('Form values restored from local storage', 'info');
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
  }

  printBill() {
    if (!this.currentBill) {
      this.showStatus('Please calculate a bill first', 'danger');
      return;
    }

    // Create print-friendly HTML
    const bill = this.currentBill;
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Power Bill - ${bill.consumerId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #333; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; }
          .total-section { margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚡ PowerBill</h1>
          <p>Electricity Bill Invoice</p>
          <p>Date: ${bill.billingDate} ${bill.billingTime}</p>
        </div>

        <div class="details">
          <h3>Consumer Details</h3>
          <div class="detail-row">
            <span class="detail-label">Consumer ID:</span>
            <span>${bill.consumerId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Consumer Name:</span>
            <span>${bill.consumerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Meter Type:</span>
            <span>${this.capitalize(bill.meterType)}</span>
          </div>
        </div>

        <div class="details">
          <h3>Energy Consumption</h3>
          <div class="detail-row">
            <span class="detail-label">Units Consumed (kWh):</span>
            <span>${bill.unitsConsumed.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Rate per Unit:</span>
            <span>₹${bill.ratePerUnit.toFixed(2)}/kWh</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Energy Charge:</span>
            <span>₹${bill.energyCharge.toFixed(2)}</span>
          </div>
        </div>

        <div class="details">
          <h3>Charges Breakdown</h3>
          <div class="detail-row">
            <span class="detail-label">Fixed Charge:</span>
            <span>₹${bill.fixedCharge.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Additional Charges:</span>
            <span>₹${bill.additionalCharges.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Subtotal:</span>
            <span>₹${bill.subtotal.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">GST (${bill.gstPercentage}%):</span>
            <span>₹${bill.gstAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="total-section">
          <div class="total-row">
            <span>TOTAL BILL AMOUNT</span>
            <span>₹${bill.totalBill.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2026 PowerBill. All rights reserved.</p>
          <p>Thank you for using our services!</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

  validateForm() {
    const required = [
      'consumerId',
      'consumerName',
      'meterType',
      'prevReading',
      'currReading',
      'ratePerUnit',
      'fixedCharge',
    ];

    for (let fieldId of required) {
      const field = document.getElementById(fieldId);
      if (!field.value || (field.type === 'number' && field.value < 0)) {
        return false;
      }
    }
    return true;
  }

  showStatus(message, type) {
    const messageDiv = document.getElementById('statusMessage');
    messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;

    // Auto-hide success and info messages after 5 seconds
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        messageDiv.innerHTML = '';
      }, 5000);
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BillCalculator();
});
