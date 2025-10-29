'use client';

import { useState } from 'react';
import BillingManagement from './components/BillingManagement';
import BillHistory from './components/BillHistory';
import ClaimBill from './components/ClaimBill';
import BillLayout from './components/BillLayout';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('billing');

  const tabs = [
    { id: 'billing', label: 'Billing Management', icon: '💵' },
    { id: 'layout', label: 'Bill Layout', icon: '📄' },
    { id: 'claims', label: 'Claim Bill', icon: '🏥' },
    { id: 'history', label: 'Bill History', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Billing & Claims</h1>
              <p className="text-gray-600">Manage billing, claims, and payment records</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
          {activeTab === 'billing' && <BillingManagement />}
          {activeTab === 'layout' && <BillLayout />}
          {activeTab === 'claims' && <ClaimBill />}
          {activeTab === 'history' && <BillHistory />}
        </div>
      </div>
    </div>
  );
}