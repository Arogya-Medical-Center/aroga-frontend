'use client';
import { useState } from 'react';

interface ClaimDetails {
  insuranceProvider: string;
  policyNumber: string;
  claimAmount: number;
  diagnosis: string;
  treatmentDetails: string;
  patientName: string;
  patientId: string;
  dateOfService: string;
}

export default function ClaimBill() {
  const [claimDetails, setClaimDetails] = useState<ClaimDetails>({
    insuranceProvider: '',
    policyNumber: '',
    claimAmount: 0,
    diagnosis: '',
    treatmentDetails: '',
    patientName: '',
    patientId: '',
    dateOfService: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(claimDetails);
    alert('Insurance claim submitted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-[#00D563] to-[#00C157] text-white p-6 rounded-t-lg shadow-lg">
        <h2 className="text-2xl font-bold">Insurance Claim Form</h2>
        <p className="text-white/90 mt-1">Submit insurance claims for patient billing</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg p-8 space-y-8">
        {/* Patient Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={claimDetails.patientName}
                onChange={e => setClaimDetails({ ...claimDetails, patientName: e.target.value })}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="Enter patient name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={claimDetails.patientId}
                onChange={e => setClaimDetails({ ...claimDetails, patientId: e.target.value })}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="Enter patient ID"
                required
              />
            </div>
          </div>
        </div>

        {/* Insurance Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Insurance Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Insurance Provider <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={claimDetails.insuranceProvider}
                onChange={e => setClaimDetails({ ...claimDetails, insuranceProvider: e.target.value })}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="e.g., Blue Cross Blue Shield"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Policy Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={claimDetails.policyNumber}
                onChange={e => setClaimDetails({ ...claimDetails, policyNumber: e.target.value })}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="Enter policy number"
                required
              />
            </div>
          </div>
        </div>

        {/* Claim Details Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Claim Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Claim Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-600 font-semibold">$</span>
                <input
                  type="number"
                  value={claimDetails.claimAmount}
                  onChange={e => setClaimDetails({ ...claimDetails, claimAmount: parseFloat(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Service <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={claimDetails.dateOfService}
                onChange={e => setClaimDetails({ ...claimDetails, dateOfService: e.target.value })}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Medical Information</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <textarea
                value={claimDetails.diagnosis}
                onChange={e => setClaimDetails({ ...claimDetails, diagnosis: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                placeholder="Enter diagnosis details..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Treatment Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={claimDetails.treatmentDetails}
                onChange={e => setClaimDetails({ ...claimDetails, treatmentDetails: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                placeholder="Describe the treatment provided..."
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            Submit Claim
          </button>
        </div>
      </form>
    </div>
  );
}