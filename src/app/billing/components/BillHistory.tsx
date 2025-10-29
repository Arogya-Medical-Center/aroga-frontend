'use client';
import { useState } from 'react';

interface Bill {
  id: string;
  patientName: string;
  billDate: string;
  amount: number;
  type: 'Regular' | 'Insurance';
  status: 'Paid' | 'Pending' | 'Overdue';
}

export default function BillHistory() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [billType, setBillType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [bills] = useState<Bill[]>([
    { id: 'BILL001', patientName: 'John Doe', billDate: '2025-10-28', amount: 150.00, type: 'Regular', status: 'Paid' },
    { id: 'BILL002', patientName: 'Jane Smith', billDate: '2025-10-29', amount: 500.00, type: 'Insurance', status: 'Pending' },
    { id: 'BILL003', patientName: 'Michael Brown', billDate: '2025-10-27', amount: 320.00, type: 'Regular', status: 'Paid' },
    { id: 'BILL004', patientName: 'Emily Davis', billDate: '2025-10-26', amount: 750.00, type: 'Insurance', status: 'Overdue' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBills = bills.filter((bill) => {
    const matchesDate = !dateRange.start || !dateRange.end || 
      (bill.billDate >= dateRange.start && bill.billDate <= dateRange.end);
    const matchesType = billType === 'all' || bill.type === billType;
    const matchesSearch = bill.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesType && matchesSearch;
  });

  const totalAmount = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Bills</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bill Type</label>
            <select
              value={billType}
              onChange={e => setBillType(e.target.value)}
              className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            >
              <option value="all">All Types</option>
              <option value="Regular">Regular</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Patient</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by patient name"
              className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Total Bills</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{filteredBills.length}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200 shadow-sm">
          <p className="text-sm text-emerald-700 font-medium">Paid</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">
            {filteredBills.filter(b => b.status === 'Paid').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 shadow-sm">
          <p className="text-sm text-yellow-700 font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-800 mt-1">
            {filteredBills.filter(b => b.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Total Amount</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Bill ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No bills found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {bill.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {bill.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(bill.billDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      ${bill.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bill.type === 'Insurance' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}>
                        {bill.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <button className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}