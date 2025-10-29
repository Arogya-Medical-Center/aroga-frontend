'use client';
import { useState } from 'react';

interface BillLayoutFields {
  hospitalName: string;
  hospitalAddress: string;
  patientName: string;
  patientId: string;
  billDate: string;
  billId: string;
  items: string;
  subtotal: string;
  tax: string;
  total: string;
  authorized: boolean;
  authorizedBy: string;
}

export default function BillLayout() {
  const [fields, setFields] = useState<BillLayoutFields>({
    hospitalName: 'Arogya Healthcare Center',
    hospitalAddress: '123 Medical Street, City, State 12345',
    patientName: '',
    patientId: '',
    billDate: '',
    billId: '',
    items: '',
    subtotal: '',
    tax: '',
    total: '',
    authorized: false,
    authorizedBy: '',
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Bill layout saved:', fields);
    alert('Bill layout saved successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toggle Preview Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Auto-generated Bill Layout</h2>
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      {!previewMode ? (
        /* Edit Mode */
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Hospital Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hospital Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Name</label>
                <input
                  type="text"
                  value={fields.hospitalName}
                  onChange={e => setFields({ ...fields, hospitalName: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter hospital name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Address</label>
                <input
                  type="text"
                  value={fields.hospitalAddress}
                  onChange={e => setFields({ ...fields, hospitalAddress: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter hospital address"
                />
              </div>
            </div>
          </div>

          {/* Patient & Bill Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Patient & Bill Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name</label>
                <input
                  type="text"
                  value={fields.patientName}
                  onChange={e => setFields({ ...fields, patientName: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text"
                  value={fields.patientId}
                  onChange={e => setFields({ ...fields, patientId: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bill ID</label>
                <input
                  type="text"
                  value={fields.billId}
                  onChange={e => setFields({ ...fields, billId: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="e.g., BILL001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bill Date</label>
                <input
                  type="date"
                  value={fields.billDate}
                  onChange={e => setFields({ ...fields, billDate: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bill Items & Amounts */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Bill Items & Amounts</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bill Items</label>
                <textarea
                  value={fields.items}
                  onChange={e => setFields({ ...fields, items: e.target.value })}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  rows={4}
                  placeholder="List bill items (one per line)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtotal</label>
                  <input
                    type="text"
                    value={fields.subtotal}
                    onChange={e => setFields({ ...fields, subtotal: e.target.value })}
                    className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tax</label>
                  <input
                    type="text"
                    value={fields.tax}
                    onChange={e => setFields({ ...fields, tax: e.target.value })}
                    className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total</label>
                  <input
                    type="text"
                    value={fields.total}
                    onChange={e => setFields({ ...fields, total: e.target.value })}
                    className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="$0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Authorization */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Authorization</h3>
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.authorized}
                  onChange={e => setFields({ ...fields, authorized: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Authorized by Staff</span>
              </label>
              {fields.authorized && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Authorized By</label>
                  <input
                    type="text"
                    value={fields.authorizedBy}
                    onChange={e => setFields({ ...fields, authorizedBy: e.target.value })}
                    className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Enter staff name"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
            >
              Save Layout
            </button>
          </div>
        </form>
      ) : (
        /* Preview Mode - Bill Template */
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-3xl mx-auto">
          <div className="border-4 border-emerald-600 p-8">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-emerald-700">{fields.hospitalName || 'Hospital Name'}</h1>
              <p className="text-gray-600 mt-2">{fields.hospitalAddress || 'Hospital Address'}</p>
              <p className="text-2xl font-bold text-gray-800 mt-4">MEDICAL BILL</p>
            </div>

            {/* Bill Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Bill ID:</p>
                <p className="font-bold text-gray-800">{fields.billId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date:</p>
                <p className="font-bold text-gray-800">{fields.billDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient Name:</p>
                <p className="font-bold text-gray-800">{fields.patientName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient ID:</p>
                <p className="font-bold text-gray-800">{fields.patientId || 'N/A'}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t-2 border-b-2 border-gray-300 py-4 my-6">
              <h3 className="font-bold text-gray-800 mb-3">Bill Items:</h3>
              <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                {fields.items || 'No items listed'}
              </pre>
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-800">{fields.subtotal || '$0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold text-gray-800">{fields.tax || '$0.00'}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-2">
                <span className="text-gray-800">Total:</span>
                <span className="text-emerald-700">{fields.total || '$0.00'}</span>
              </div>
            </div>

            {/* Authorization */}
            {fields.authorized && (
              <div className="border-t-2 border-gray-300 pt-6 mt-6">
                <p className="text-sm text-gray-600">Authorized By:</p>
                <p className="font-bold text-gray-800">{fields.authorizedBy || 'Staff Member'}</p>
                <p className="text-xs text-gray-500 mt-2">Signature: __________________</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}