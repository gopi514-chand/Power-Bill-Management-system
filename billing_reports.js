// Billing Reports JavaScript
class BillingReports {
  constructor() {
    this.allBills = [];
    this.filteredBills = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.billToDelete = null;
    this.initializeEventListeners();
    this.loadBills();
  }

  initializeEventListeners() {
    document.getElementById('filterBtn').addEventListener('click', () => this.applyFilters());
    document.getElementById('resetFilterBtn').addEventListener('click', () => this.resetFilters());
    document.getElementById('exportBtn').addEventListener('click', () => this.exportToCSV());
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
  }

  loadBills() {
    // Try to load from server first
    fetch('/api/bills/all')
      .then(response => response.json())
      .then(data => {
        this.allBills = data;
        this.filteredBills = [...this.allBills];
        this.displayBills();
        this.updateStatistics();
      })
      .catch(error => {
        console.error('Error loading from server:', error);
        this.loadFromLocalStorage();
      });
  }

  loadFromLocalStorage() {
    try {
      const bills = JSON.parse(localStorage.getItem('powerBills')) || [];
      this.allBills = bills;
      this.filteredBills = [...this.allBills];
      this.displayBills();
      this.updateStatistics();
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  applyFilters() {
    const consumerId = document.getElementById('filterConsumerId').value.toLowerCase();
    const consumerName = document.getElementById('filterConsumerName').value.toLowerCase();
    const meterType = document.getElementById('filterMeterType').value;
    const dateRange = document.getElementById('filterDateRange').value;

    this.filteredBills = this.allBills.filter(bill => {
      let match = true;

      // Filter by Consumer ID
      if (consumerId && !bill.consumerId.toLowerCase().includes(consumerId)) {
        match = false;
      }

      // Filter by Consumer Name
      if (consumerName && !bill.consumerName.toLowerCase().includes(consumerName)) {
        match = false;
      }

      // Filter by Meter Type
      if (meterType && bill.meterType !== meterType) {
        match = false;
      }

      // Filter by Date Range
      if (dateRange !== 'all') {
        const billDate = new Date(bill.billingDate);
        const today = new Date();
        let startDate;

        switch (dateRange) {
          case 'today':
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            break;
          case 'week':
            startDate = new Date(today.setDate(today.getDate() - today.getDay()));
            break;
          case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
          case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            startDate = new Date(today.getFullYear(), quarter * 3, 1);
            break;
          case 'year':
            startDate = new Date(today.getFullYear(), 0, 1);
            break;
        }

        if (billDate < startDate) {
          match = false;
        }
      }

      return match;
    });

    this.currentPage = 1;
    this.displayBills();
    this.updateStatistics();
  }

  resetFilters() {
    document.getElementById('filterConsumerId').value = '';
    document.getElementById('filterConsumerName').value = '';
    document.getElementById('filterMeterType').value = '';
    document.getElementById('filterDateRange').value = 'all';

    this.filteredBills = [...this.allBills];
    this.currentPage = 1;
    this.displayBills();
    this.updateStatistics();
  }

  displayBills() {
    const tbody = document.getElementById('billsTableBody');

    if (this.filteredBills.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">No bills found.</td></tr>';
      document.getElementById('pagination').style.display = 'none';
      return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(this.filteredBills.length / this.itemsPerPage);
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    const paginatedBills = this.filteredBills.slice(startIdx, endIdx);

    // Generate table rows
    let html = '';
    paginatedBills.forEach((bill, index) => {
      const billId = bill.id || `BILL-${startIdx + index + 1}`;
      html += `
        <tr>
          <td>#${billId}</td>
          <td>${bill.consumerId}</td>
          <td>${bill.consumerName}</td>
          <td><span class="badge bg-info">${this.capitalize(bill.meterType)}</span></td>
          <td>${bill.unitsConsumed.toFixed(2)}</td>
          <td>₹${bill.energyCharge.toFixed(2)}</td>
          <td><strong>₹${bill.totalBill.toFixed(2)}</strong></td>
          <td>${bill.billingDate}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="billingReports.viewBill('${billId}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-warning" onclick="billingReports.editBill('${billId}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="billingReports.deleteBill('${billId}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    // Display pagination
    if (totalPages > 1) {
      this.displayPagination(totalPages);
      document.getElementById('pagination').style.display = 'block';
    } else {
      document.getElementById('pagination').style.display = 'none';
    }
  }

  displayPagination(totalPages) {
    const pagination = document.querySelector('.pagination');
    let html = '';

    // Previous button
    if (this.currentPage > 1) {
      html += `<li class="page-item"><a class="page-link" onclick="billingReports.goToPage(${this.currentPage - 1})">Previous</a></li>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === this.currentPage) {
        html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
      } else {
        html += `<li class="page-item"><a class="page-link" onclick="billingReports.goToPage(${i})">${i}</a></li>`;
      }
    }

    // Next button
    if (this.currentPage < totalPages) {
      html += `<li class="page-item"><a class="page-link" onclick="billingReports.goToPage(${this.currentPage + 1})">Next</a></li>`;
    }

    pagination.innerHTML = html;
  }

  goToPage(pageNumber) {
    this.currentPage = pageNumber;
    this.displayBills();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateStatistics() {
    if (this.filteredBills.length === 0) {
      document.getElementById('totalBills').textContent = '0';
      document.getElementById('totalAmount').textContent = '₹0';
      document.getElementById('totalUnits').textContent = '0 kWh';
      document.getElementById('averageBill').textContent = '₹0';
      return;
    }

    const totalBills = this.filteredBills.length;
    const totalAmount = this.filteredBills.reduce((sum, bill) => sum + bill.totalBill, 0);
    const totalUnits = this.filteredBills.reduce((sum, bill) => sum + bill.unitsConsumed, 0);
    const averageBill = totalAmount / totalBills;

    document.getElementById('totalBills').textContent = totalBills;
    document.getElementById('totalAmount').textContent = `₹${totalAmount.toFixed(2)}`;
    document.getElementById('totalUnits').textContent = `${totalUnits.toFixed(2)} kWh`;
    document.getElementById('averageBill').textContent = `₹${averageBill.toFixed(2)}`;
  }

  viewBill(billId) {
    const bill = this.findBillById(billId);
    if (!bill) {
      alert('Bill not found');
      return;
    }

    // Create and display bill details
    const details = `
Consumer ID: ${bill.consumerId}
Consumer Name: ${bill.consumerName}
Meter Type: ${this.capitalize(bill.meterType)}
Billing Date: ${bill.billingDate}

Units Consumed: ${bill.unitsConsumed.toFixed(2)} kWh
Rate per Unit: ₹${bill.ratePerUnit.toFixed(2)}/kWh
Energy Charge: ₹${bill.energyCharge.toFixed(2)}

Fixed Charge: ₹${bill.fixedCharge.toFixed(2)}
Additional Charges: ₹${bill.additionalCharges.toFixed(2)}
Subtotal: ₹${bill.subtotal.toFixed(2)}

GST (${bill.gstPercentage}%): ₹${bill.gstAmount.toFixed(2)}

TOTAL BILL: ₹${bill.totalBill.toFixed(2)}
    `;

    alert(details);
  }

  editBill(billId) {
    // Implement edit functionality
    alert('Edit feature coming soon!');
  }

  deleteBill(billId) {
    this.billToDelete = billId;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
  }

  confirmDelete() {
    if (!this.billToDelete) return;

    const billIndex = this.allBills.findIndex(bill => (bill.id || `BILL-${this.allBills.indexOf(bill) + 1}`) === this.billToDelete);
    
    if (billIndex > -1) {
      this.allBills.splice(billIndex, 1);
      localStorage.setItem('powerBills', JSON.stringify(this.allBills));
      this.filteredBills = [...this.allBills];
      this.displayBills();
      this.updateStatistics();
      
      // Close modal
      bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      
      alert('Bill deleted successfully!');
    }

    this.billToDelete = null;
  }

  findBillById(billId) {
    return this.filteredBills.find(bill => (bill.id || `BILL-${this.filteredBills.indexOf(bill) + 1}`) === billId);
  }

  exportToCSV() {
    if (this.filteredBills.length === 0) {
      alert('No data to export');
      return;
    }

    let csv = 'Bill ID,Consumer ID,Consumer Name,Meter Type,Units (kWh),Rate (₹/kWh),Energy Charge (₹),Fixed Charge (₹),Additional Charges (₹),Subtotal (₹),GST %,GST Amount (₹),Total Bill (₹),Billing Date\n';

    this.filteredBills.forEach((bill, index) => {
      const billId = bill.id || `BILL-${index + 1}`;
      csv += `"${billId}","${bill.consumerId}","${bill.consumerName}","${bill.meterType}",${bill.unitsConsumed},${bill.ratePerUnit},${bill.energyCharge},${bill.fixedCharge},${bill.additionalCharges},${bill.subtotal},${bill.gstPercentage},${bill.gstAmount},${bill.totalBill},"${bill.billingDate}"\n`;
    });

    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Global reference for onclick handlers
let billingReports;

// Initialize reports when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  billingReports = new BillingReports();
});
