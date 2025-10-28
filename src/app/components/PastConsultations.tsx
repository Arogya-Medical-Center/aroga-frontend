"use client";

import { useState } from "react";
import { ConsultationData } from "./ConsultationForm";

interface PastConsultationsProps {
  consultations: ConsultationData[];
  onViewConsultation?: (consultation: ConsultationData) => void;
  onEditConsultation?: (consultation: ConsultationData) => void;
  onDeleteConsultation?: (consultationId: string) => void;
}

type ViewMode = 'table' | 'cards';

export default function PastConsultations({
  consultations,
  onViewConsultation,
  onEditConsultation,
  onDeleteConsultation,
}: PastConsultationsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'doctor' | 'diagnosis'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort consultations
  const filteredConsultations = consultations
    .filter(consultation => {
      const searchLower = searchTerm.toLowerCase();
      return (
        consultation.patientName.toLowerCase().includes(searchLower) ||
        consultation.diagnosis.toLowerCase().includes(searchLower) ||
        consultation.doctorName.toLowerCase().includes(searchLower) ||
        consultation.symptoms.some(symptom => symptom.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'doctor':
          comparison = a.doctorName.localeCompare(b.doctorName);
          break;
        case 'diagnosis':
          comparison = a.diagnosis.localeCompare(b.diagnosis);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Past Consultations</h2>
            <p className="text-sm text-neutral-600 mt-1">
              {consultations.length} consultation{consultations.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${
                viewMode === 'table'
                  ? 'bg-green-100 text-green-700'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              <TableIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md ${
                viewMode === 'cards'
                  ? 'bg-green-100 text-green-700'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              <GridIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="date">Sort by Date</option>
              <option value="doctor">Sort by Doctor</option>
              <option value="diagnosis">Sort by Diagnosis</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOrder === 'asc' ? (
                <SortAscIcon className="h-4 w-4" />
              ) : (
                <SortDescIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredConsultations.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-neutral-400 mb-4">
            <FileTextIcon className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No consultations found</h3>
          <p className="text-neutral-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'No past consultations available.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <TableView
          consultations={filteredConsultations}
          formatDate={formatDate}
          truncateText={truncateText}
          onViewConsultation={onViewConsultation}
          onEditConsultation={onEditConsultation}
          onDeleteConsultation={onDeleteConsultation}
        />
      ) : (
        <CardsView
          consultations={filteredConsultations}
          formatDate={formatDate}
          truncateText={truncateText}
          onViewConsultation={onViewConsultation}
          onEditConsultation={onEditConsultation}
          onDeleteConsultation={onDeleteConsultation}
        />
      )}
    </div>
  );
}

// Table View Component
function TableView({
  consultations,
  formatDate,
  truncateText,
  onViewConsultation,
  onEditConsultation,
  onDeleteConsultation,
}: {
  consultations: ConsultationData[];
  formatDate: (date: string) => string;
  truncateText: (text: string, maxLength?: number) => string;
  onViewConsultation?: (consultation: ConsultationData) => void;
  onEditConsultation?: (consultation: ConsultationData) => void;
  onDeleteConsultation?: (consultationId: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Symptoms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Diagnosis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Doctor
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-200">
          {consultations.map((consultation) => (
            <tr key={consultation.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                {formatDate(consultation.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-neutral-900">{consultation.patientName}</div>
                <div className="text-sm text-neutral-500">ID: {consultation.patientId}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-neutral-900">
                  {truncateText(consultation.symptoms.join(', '), 80)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-neutral-900">
                  {truncateText(consultation.diagnosis, 100)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                {consultation.doctorName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <ActionButtons
                  consultation={consultation}
                  onViewConsultation={onViewConsultation}
                  onEditConsultation={onEditConsultation}
                  onDeleteConsultation={onDeleteConsultation}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Cards View Component
function CardsView({
  consultations,
  formatDate,
  truncateText,
  onViewConsultation,
  onEditConsultation,
  onDeleteConsultation,
}: {
  consultations: ConsultationData[];
  formatDate: (date: string) => string;
  truncateText: (text: string, maxLength?: number) => string;
  onViewConsultation?: (consultation: ConsultationData) => void;
  onEditConsultation?: (consultation: ConsultationData) => void;
  onDeleteConsultation?: (consultationId: string) => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {consultations.map((consultation) => (
        <div
          key={consultation.id}
          className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-neutral-500">
              {formatDate(consultation.date)}
            </div>
            <ActionButtons
              consultation={consultation}
              onViewConsultation={onViewConsultation}
              onEditConsultation={onEditConsultation}
              onDeleteConsultation={onDeleteConsultation}
              isCompact
            />
          </div>

          {/* Patient Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-neutral-900">{consultation.patientName}</h3>
            <p className="text-sm text-neutral-500">ID: {consultation.patientId}</p>
          </div>

          {/* Symptoms */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Symptoms</h4>
            <p className="text-sm text-neutral-600">
              {truncateText(consultation.symptoms.join(', '), 60)}
            </p>
          </div>

          {/* Diagnosis */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Diagnosis</h4>
            <p className="text-sm text-neutral-600">
              {truncateText(consultation.diagnosis, 80)}
            </p>
          </div>

          {/* Doctor */}
          <div className="text-sm text-neutral-500">
            Dr. {consultation.doctorName}
          </div>
        </div>
      ))}
    </div>
  );
}

// Action Buttons Component
function ActionButtons({
  consultation,
  onViewConsultation,
  onEditConsultation,
  onDeleteConsultation,
  isCompact = false,
}: {
  consultation: ConsultationData;
  onViewConsultation?: (consultation: ConsultationData) => void;
  onEditConsultation?: (consultation: ConsultationData) => void;
  onDeleteConsultation?: (consultationId: string) => void;
  isCompact?: boolean;
}) {
  return (
    <div className={`flex items-center ${isCompact ? 'gap-1' : 'gap-2'}`}>
      {onViewConsultation && (
        <button
          onClick={() => onViewConsultation(consultation)}
          className="text-blue-600 hover:text-blue-800 p-1"
          title="View Details"
        >
          <EyeIcon className="h-4 w-4" />
        </button>
      )}
      {onEditConsultation && (
        <button
          onClick={() => onEditConsultation(consultation)}
          className="text-green-600 hover:text-green-800 p-1"
          title="Edit"
        >
          <EditIcon className="h-4 w-4" />
        </button>
      )}
      {onDeleteConsultation && consultation.id && (
        <button
          onClick={() => onDeleteConsultation(consultation.id!)}
          className="text-red-600 hover:text-red-800 p-1"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Icons
function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3h18v18H3zM21 9H3M9 21V9" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
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

function SortAscIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M7 12h10M10 18h4" />
    </svg>
  );
}

function SortDescIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 6h4M7 12h10M3 18h18" />
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

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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