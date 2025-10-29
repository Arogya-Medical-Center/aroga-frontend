"use client";

import { useState, useEffect } from "react";
import ConsultationForm, { ConsultationData } from "../components/ConsultationForm";
import PastConsultations from "../components/PastConsultations";

// Mock data for demonstration - in a real app, this would come from an API
const MOCK_CONSULTATIONS: ConsultationData[] = [
  {
    id: "CONS001",
    patientId: "PAT001",
    patientName: "John Doe",
    date: "2024-10-25",
    symptoms: ["Fever", "Headache", "Fatigue"],
    diagnosis: "Viral infection with mild dehydration. Patient shows signs of seasonal flu with elevated temperature.",
    treatment: "Rest for 3-5 days, increase fluid intake, paracetamol 500mg every 6 hours as needed for fever. Follow up if symptoms worsen.",
    notes: ["Patient has history of seasonal allergies", "Recommended to avoid dairy products temporarily"],
    doctorId: "DOC001",
    doctorName: "Dr. Danushka Ranasinghe",
    prescriptions: ["Paracetamol 500mg", "Vitamin C tablets"]
  },
  {
    id: "CONS002",
    patientId: "PAT002",
    patientName: "Jane Smith",
    date: "2024-10-20",
    symptoms: ["Chest pain", "Shortness of breath"],
    diagnosis: "Anxiety-related chest pain. No signs of cardiac issues on preliminary examination.",
    treatment: "Prescribed mild anxiolytic, breathing exercises, and stress management techniques. Cardiology referral if symptoms persist.",
    notes: ["Patient under work stress", "Recommend follow-up in 2 weeks"],
    doctorId: "DOC002",
    doctorName: "Dr. Sarah Johnson",
    prescriptions: ["Lorazepam 0.5mg as needed"]
  },
  {
    id: "CONS003",
    patientId: "PAT001",
    patientName: "John Doe",
    date: "2024-10-15",
    symptoms: ["Stomach pain", "Nausea"],
    diagnosis: "Gastritis likely due to dietary changes and stress.",
    treatment: "Antacid medication, bland diet for one week, avoid spicy foods and alcohol.",
    notes: ["Patient reports irregular eating habits"],
    doctorId: "DOC001",
    doctorName: "Dr. Danushka Ranasinghe",
    prescriptions: ["Omeprazole 20mg", "Antacid tablets"]
  }
];

type PageMode = 'list' | 'new' | 'edit' | 'view';

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<ConsultationData[]>(MOCK_CONSULTATIONS);
  const [pageMode, setPageMode] = useState<PageMode>('list');
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');

  // Filter consultations based on search
  const filteredConsultations = consultations.filter(consultation =>
    consultation.patientName.toLowerCase().includes(searchPatient.toLowerCase()) ||
    consultation.patientId.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const handleNewConsultation = () => {
    setSelectedConsultation(null);
    setPageMode('new');
  };

  const handleViewConsultation = (consultation: ConsultationData) => {
    setSelectedConsultation(consultation);
    setPageMode('view');
  };

  const handleEditConsultation = (consultation: ConsultationData) => {
    setSelectedConsultation(consultation);
    setPageMode('edit');
  };

  const handleDeleteConsultation = async (consultationId: string) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        setConsultations(prev => prev.filter(c => c.id !== consultationId));
      } catch (error) {
        console.error('Error deleting consultation:', error);
        alert('Failed to delete consultation');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitConsultation = async (data: ConsultationData) => {
    setIsLoading(true);
    try {
      if (pageMode === 'new') {
        // Create new consultation
        const newConsultation = {
          ...data,
          id: `CONS${String(consultations.length + 1).padStart(3, '0')}`,
        };
        setConsultations(prev => [newConsultation, ...prev]);
      } else if (pageMode === 'edit' && selectedConsultation) {
        // Update existing consultation
        const updatedConsultation = {
          ...data,
          id: selectedConsultation.id,
        };
        setConsultations(prev =>
          prev.map(c => c.id === selectedConsultation.id ? updatedConsultation : c)
        );
      }
      setPageMode('list');
      setSelectedConsultation(null);
    } catch (error) {
      console.error('Error saving consultation:', error);
      alert('Failed to save consultation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPageMode('list');
    setSelectedConsultation(null);
  };

  if (pageMode === 'new' || pageMode === 'edit') {
    return (
      <div className="max-w-4xl mx-auto">
        <ConsultationForm
          initialData={pageMode === 'edit' ? selectedConsultation || undefined : undefined}
          onSubmit={handleSubmitConsultation}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (pageMode === 'view' && selectedConsultation) {
    return (
      <ConsultationDetailView
        consultation={selectedConsultation}
        onEdit={() => handleEditConsultation(selectedConsultation)}
        onBack={handleCancel}
        onDelete={() => handleDeleteConsultation(selectedConsultation.id!)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Doctor's Consultation Interface</h1>
            <p className="text-neutral-600 mt-1">
              Manage patient consultations, view history, and create new consultation records
            </p>
          </div>
          <button
            onClick={handleNewConsultation}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Consultation
          </button>
        </div>

        {/* Quick Patient Search */}
        <div className="mt-6">
          <div className="max-w-md">
            <label htmlFor="patient-search" className="block text-sm font-medium text-neutral-700 mb-2">
              Search by Patient Name or ID
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                id="patient-search"
                placeholder="Enter patient name or ID..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Total Consultations</p>
              <p className="text-2xl font-semibold text-neutral-900">{consultations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">This Month</p>
              <p className="text-2xl font-semibold text-neutral-900">
                {consultations.filter(c => {
                  const consultationDate = new Date(c.date);
                  const now = new Date();
                  return consultationDate.getMonth() === now.getMonth() &&
                         consultationDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600">Unique Patients</p>
              <p className="text-2xl font-semibold text-neutral-900">
                {new Set(consultations.map(c => c.patientId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Past Consultations */}
      <PastConsultations
        consultations={filteredConsultations}
        onViewConsultation={handleViewConsultation}
        onEditConsultation={handleEditConsultation}
        onDeleteConsultation={handleDeleteConsultation}
      />
    </div>
  );
}

// Consultation Detail View Component
function ConsultationDetailView({
  consultation,
  onEdit,
  onBack,
  onDelete,
}: {
  consultation: ConsultationData;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
}) {
  const formatDate = (dateString: string) => {
    // Use a consistent format to avoid hydration issues
    const date = new Date(dateString);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const weekday = weekdays[date.getDay()];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${weekday}, ${month} ${day}, ${year}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Consultations
          </button>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Consultation Details</h1>
          <p className="text-neutral-600 mt-1">{formatDate(consultation.date)}</p>
        </div>
      </div>

      {/* Consultation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Info */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Patient Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-600">Patient Name</p>
                <p className="text-neutral-900">{consultation.patientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Patient ID</p>
                <p className="text-neutral-900">{consultation.patientId}</p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Reported Symptoms</h2>
            <ul className="space-y-2">
              {consultation.symptoms.map((symptom, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-neutral-700">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnosis */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Diagnosis</h2>
            <p className="text-neutral-700 leading-relaxed">{consultation.diagnosis}</p>
          </div>

          {/* Treatment */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Treatment Plan</h2>
            <p className="text-neutral-700 leading-relaxed">{consultation.treatment}</p>
          </div>

          {/* Notes */}
          {consultation.notes.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Additional Notes</h2>
              <ul className="space-y-2">
                {consultation.notes.map((note, index) => (
                  <li key={index} className="text-neutral-700 leading-relaxed">
                    • {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Doctor Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-neutral-600">Attending Doctor</p>
                <p className="text-neutral-900">{consultation.doctorName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600">Doctor ID</p>
                <p className="text-neutral-900">{consultation.doctorId}</p>
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          {consultation.prescriptions && consultation.prescriptions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Prescriptions</h3>
              <ul className="space-y-2">
                {consultation.prescriptions.map((prescription, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-neutral-700">{prescription}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}