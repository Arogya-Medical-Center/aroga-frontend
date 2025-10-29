'use client';
import { useState } from 'react';

interface BillItem {
  service: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BillData {
  billId: string;
  patientId: string;
  patientName: string;
  billDate: string;
  authorized: boolean;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  generatedAt: string;
  status: string;
}

export default function BillingManagement() {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [billDate, setBillDate] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBillItem = () => {
    setBillItems([...billItems, { service: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const updateBillItem = (index: number, field: keyof BillItem, value: string | number) => {
    const newBillItems = [...billItems];
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    newBillItems[index] = {
      ...newBillItems[index],
      [field]: field === 'service' ? value : numValue,
    };

    if (field === 'quantity' || field === 'unitPrice') {
      newBillItems[index].total = newBillItems[index].quantity * newBillItems[index].unitPrice;
    }

    setBillItems(newBillItems);
  };

  const removeBillItem = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const generatePDF = (billData: BillData) => {
    const billHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Medical Bill - ${billData.billId}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 40px;
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 4px solid #00D563; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .hospital-name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #00D563; 
            margin-bottom: 8px;
          }
          .bill-title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-top: 15px;
            color: #333;
          }
          .info-section { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .info-item { margin-bottom: 10px; }
          .info-label { 
            font-size: 12px; 
            color: #666; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-value { 
            font-size: 16px; 
            font-weight: bold; 
            color: #333; 
            margin-top: 4px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 30px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          th { 
            background: #00D563; 
            color: white; 
            padding: 15px; 
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          td { 
            padding: 12px 15px; 
            border-bottom: 1px solid #e0e0e0;
          }
          tr:hover { background: #f8f9fa; }
          .totals-section { 
            margin-top: 30px; 
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 10px 0;
            font-size: 16px;
          }
          .total-row.grand-total { 
            border-top: 3px solid #00D563; 
            margin-top: 15px;
            padding-top: 15px;
            font-size: 20px; 
            font-weight: bold;
          }
          .total-row.grand-total .amount { color: #00D563; }
          .footer { 
            margin-top: 50px; 
            padding-top: 20px; 
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .authorization { 
            margin-top: 40px; 
            padding: 20px;
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">Arogya Healthcare Center</div>
          <div style="color: #666; margin-top: 5px;">123 Medical Street, City, State 12345</div>
          <div style="color: #666; margin-top: 5px;">Phone: (555) 123-4567 | Email: info@arogya.com</div>
          <div class="bill-title">MEDICAL BILL</div>
        </div>

        <div class="info-section">
          <div>
            <div class="info-item">
              <div class="info-label">Bill ID</div>
              <div class="info-value">${billData.billId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Patient Name</div>
              <div class="info-value">${billData.patientName}</div>
            </div>
          </div>
          <div>
            <div class="info-item">
              <div class="info-label">Patient ID</div>
              <div class="info-value">${billData.patientId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Bill Date</div>
              <div class="info-value">${new Date(billData.billDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50%">Service Description</th>
              <th style="width: 15%; text-align: center;">Quantity</th>
              <th style="width: 17%; text-align: right;">Unit Price</th>
              <th style="width: 18%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${billData.items.map((item: BillItem) => `
              <tr>
                <td><strong>${item.service}</strong></td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">LKR ${item.unitPrice.toFixed(2)}</td>
                <td style="text-align: right;"><strong>LKR ${item.total.toFixed(2)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span class="amount">LKR ${billData.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax (10%):</span>
            <span class="amount">LKR ${billData.tax.toFixed(2)}</span>
          </div>
          <div class="total-row grand-total">
            <span>TOTAL AMOUNT:</span>
            <span class="amount">LKR ${billData.total.toFixed(2)}</span>
          </div>
        </div>

        ${billData.authorized ? `
          <div class="authorization">
            <strong>✓ Authorized by Staff</strong>
            <div style="margin-top: 10px;">This bill has been reviewed and authorized by hospital staff.</div>
          </div>
        ` : ''}

        <div class="footer">
          <p><strong>Thank you for choosing Arogya Healthcare Center</strong></p>
          <p>This is a computer-generated bill. For queries, please contact our billing department.</p>
          <p style="margin-top: 20px; font-size: 11px;">Generated on: ${new Date(billData.generatedAt).toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(billHTML);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }

  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientId || !patientName || !billDate) {
      alert('Please fill in all required patient information');
      return;
    }
    
    if (billItems.length === 0) {
      alert('Please add at least one bill item');
      return;
    }
    
    if (!authorized) {
      alert('Bill must be authorized by staff before generation');
      return;
    }
    
    setIsSubmitting(true);
    
    const billData: BillData = {
      billId: `BILL${Date.now().toString().slice(-6)}`,
      patientId,
      patientName,
      billDate,
      authorized,
      items: billItems,
      subtotal: calculateTotal(),
      tax: calculateTotal() * 0.1,
      total: calculateTotal() * 1.1,
      generatedAt: new Date().toISOString(),
      status: 'Generated'
    };
    
    setTimeout(() => {
      generatePDF(billData);
      setIsSubmitting(false);
      
      const shouldReset = confirm('Bill generated successfully! Do you want to create another bill?');
      if (shouldReset) {
        setPatientId('');
        setPatientName('');
        setBillDate('');
        setBillItems([]);
        setAuthorized(false);
      }
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Patient ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-[#00D563] focus:ring-2 focus:ring-[#00D563]/20 outline-none transition-all"
            placeholder="Enter patient ID"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            placeholder="Enter patient name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bill Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            required
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Bill Items</h3>
          <button
            type="button"
            onClick={addBillItem}
            className="px-5 py-2.5 bg-[#00D563] text-white font-medium rounded-lg hover:bg-[#00C157] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            + Add Item
          </button>
        </div>

        {billItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No items added yet. Click Add Item to start.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3 px-2 text-sm font-semibold text-gray-600">
              <div className="col-span-4">Service Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2"></div>
            </div>
            {billItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={item.service}
                    onChange={(e) => updateBillItem(index, 'service', e.target.value)}
                    placeholder="e.g., Consultation"
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-[#00D563] focus:ring-1 focus:ring-[#00D563]/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateBillItem(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    required
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateBillItem(index, 'unitPrice', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={`LKR ${item.total.toFixed(2)}`}
                    className="w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md font-semibold"
                    disabled
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => removeBillItem(index)}
                    className="w-full px-3 py-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md transition-colors font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <div className="bg-[#00D563]/10 px-6 py-3 rounded-lg border-2 border-[#00D563]/30">
            <span className="text-sm text-gray-600 mr-2">Total Amount:</span>
            <span className="text-2xl font-bold text-[#00D563]">
              LKR {calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200">
        <div className="flex flex-col gap-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
              className="w-5 h-5 text-[#00D563] bg-white border-gray-300 rounded focus:ring-[#00D563] focus:ring-2"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Authorized by Staff
            </span>
          </label>
          {!authorized && (
            <p className="ml-8 text-xs text-amber-600">
              ⚠️ Authorization required to generate bill
            </p>
          )}
          {billItems.length === 0 && (
            <p className="ml-8 text-xs text-amber-600">
              ⚠️ Add at least one bill item
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!authorized || billItems.length === 0 || isSubmitting}
          className="px-8 py-3 bg-[#00D563] text-white font-semibold rounded-lg hover:bg-[#00C157] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>📄</span>
              <span>Generate Bill PDF</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}