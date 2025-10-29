'use client';
import { useState } from 'react';

interface BillItem {
  service: string;
  quantity: number;
  unitPrice: number;
  total: number;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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
    
    // Generate bill data
    const billData = {
      billId: `BILL${Date.now().toString().slice(-6)}`,
      patientId,
      patientName,
      billDate,
      authorized,
      items: billItems,
      subtotal: calculateTotal(),
      tax: calculateTotal() * 0.1, // 10% tax
      total: calculateTotal() * 1.1,
      generatedAt: new Date().toISOString(),
      status: 'Generated'
    };
    
    console.log('Bill Generated Successfully:', billData);
    
    // Show success message
    alert(`✅ Bill Generated Successfully!\n\nBill ID: ${billData.billId}\nPatient: ${patientName}\nTotal Amount: ${billData.total.toFixed(2)}\n\nBill has been saved to the system.`);
    
    // Reset form after successful generation
    const shouldReset = confirm('Do you want to create another bill?');
    if (shouldReset) {
      setPatientId('');
      setPatientName('');
      setBillDate('');
      setBillItems([]);
      setAuthorized(false);
    }
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
                    value={`$${item.total.toFixed(2)}`}
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
              ${calculateTotal().toFixed(2)}
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
          title={
            !authorized 
              ? 'Please authorize the bill first' 
              : billItems.length === 0 
                ? 'Please add at least one bill item' 
                : 'Generate bill'
          }
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Bill...</span>
            </>
          ) : (
            <>
              <span>🧾</span>
              <span>Generate Bill</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}