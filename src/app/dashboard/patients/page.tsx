"use client";

import { useState } from "react";

// Define TypeScript interfaces
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  primaryIllness: string;
  lastVisit: string;
  doctor: string;
}

interface Consultation {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  symptoms: string;
  prescription: string;
  notes: string;
}

// Mock data for patients
const mockPatients: Patient[] = [
  {
    id: "P00123",
    name: "John Doe",
    age: 45,
    gender: "Male",
    contact: "(123) 456-7890",
    primaryIllness: "Seasonal Flu",
    lastVisit: "2025-10-20",
    doctor: "Dr. Smith"
  },
  {
    id: "P00124",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    contact: "(123) 456-7891",
    primaryIllness: "Migraine",
    lastVisit: "2025-10-22",
    doctor: "Dr. Reed"
  },
  {
    id: "P00125",
    name: "Robert Johnson",
    age: 58,
    gender: "Male",
    contact: "(123) 456-7892",
    primaryIllness: "Allergy Checkup",
    lastVisit: "2025-10-23",
    doctor: "Dr. Smith"
  },
  {
    id: "P00126",
    name: "Emily Williams",
    age: 28,
    gender: "Female",
    contact: "(123) 456-7893",
    primaryIllness: "Hypertension",
    lastVisit: "2025-10-24",
    doctor: "Dr. Reed"
  },
  {
    id: "P00127",
    name: "Michael Brown",
    age: 41,
    gender: "Male",
    contact: "(123) 456-7894",
    primaryIllness: "Routine Physical",
    lastVisit: "2025-10-25",
    doctor: "Dr. Smith"
  },
  {
    id: "P00128",
    name: "Sarah Williams",
    age: 35,
    gender: "Female",
    contact: "(123) 456-7895",
    primaryIllness: "Diabetes Checkup",
    lastVisit: "2025-10-26",
    doctor: "Dr. Danushka"
  }
];

// Mock consultation history
const mockConsultations: Consultation[] = [
  {
    id: "C001",
    date: "2025-10-20",
    doctor: "Dr. Smith",
    diagnosis: "Acute Viral Rhinitis",
    symptoms: "Runny nose, sore throat, mild fever",
    prescription: "Paracetamol 500mg TDS, Cetirizine 10mg OD",
    notes: "Patient advised rest and fluid intake. Follow-up in 1 week if symptoms persist."
  },
  {
    id: "C002",
    date: "2025-09-15",
    doctor: "Dr. Reed",
    diagnosis: "Upper Respiratory Infection",
    symptoms: "Cough, congestion, fatigue",
    prescription: "Amoxicillin 500mg TDS x 7 days",
    notes: "Complete full course of antibiotics."
  },
  {
    id: "C003",
    date: "2025-08-10",
    doctor: "Dr. Smith",
    diagnosis: "Annual Health Screening",
    symptoms: "None - preventive care",
    prescription: "Multivitamin supplements",
    notes: "Blood pressure normal. All vitals within range."
  }
];

export default function PatientManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showConsultationHistory, setShowConsultationHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter patients based on search and filters
  const filteredPatients = mockPatients.filter((patient: Patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contact.includes(searchQuery) ||
      patient.primaryIllness.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDoctor = !filterDoctor || patient.doctor === filterDoctor;
    
    return matchesSearch && matchesDoctor;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterDoctor("");
    setFilterDateRange("");
    setCurrentPage(1);
  };

  const handleViewConsultation = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowConsultationHistory(true);
  };

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      {!showConsultationHistory ? (
        <>
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">Patient Management</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search & Filter Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Search & Filter Patients</h2>
                
                {/* Search Input */}
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900 placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                {/* Filter by Doctor */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-800 mb-2">Filter by Doctor</label>
                  <select
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-800"
                  >
                    <option value="">All Doctors</option>
                    <option value="Dr. Smith">Dr. Smith</option>
                    <option value="Dr. Reed">Dr. Reed</option>
                    <option value="Dr. Danushka">Dr. Danushka</option>
                  </select>
                </div>

                {/* Filter by Date Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-800 mb-2">Filter by Date Range</label>
                  <select
                    value={filterDateRange}
                    onChange={(e) => setFilterDateRange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-800"
                  >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="w-full py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors mb-3"
                >
                  Clear All
                </button>

                <button className="w-full py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Patient Table */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Patient Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Patient ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Primary Illness</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {paginatedPatients.map((patient: Patient) => (
                        <tr key={patient.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{patient.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{patient.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{patient.primaryIllness}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewConsultation(patient)}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              View Consultation Summary
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length} Entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Consultation History View */
        <div>
          <button
            onClick={() => setShowConsultationHistory(false)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <BackIcon />
            Back to Patient List
          </button>

          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{selectedPatient?.name}</h2>
                <div className="mt-2 space-y-1 text-sm text-neutral-600">
                  <p><span className="font-medium">Patient ID:</span> {selectedPatient?.id}</p>
                  <p><span className="font-medium">Age:</span> {selectedPatient?.age} years</p>
                  <p><span className="font-medium">Gender:</span> {selectedPatient?.gender}</p>
                  <p><span className="font-medium">Contact:</span> {selectedPatient?.contact}</p>
                  <p><span className="font-medium">Primary Illness:</span> {selectedPatient?.primaryIllness}</p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                <EditIcon />
                Edit Profile
              </button>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Visit History & Consultation Summary</h3>

              <div className="space-y-4">
                {mockConsultations.map((consultation: Consultation) => (
                  <div key={consultation.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-semibold text-neutral-900">{consultation.date}</span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{consultation.doctor}</span>
                        </div>
                        <p className="text-sm text-neutral-600">Consultation ID: {consultation.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-neutral-700 mb-1">Diagnosis:</p>
                        <p className="text-neutral-600">{consultation.diagnosis}</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-700 mb-1">Symptoms:</p>
                        <p className="text-neutral-600">{consultation.symptoms}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="font-medium text-neutral-700 mb-1">Prescription:</p>
                        <p className="text-neutral-600">{consultation.prescription}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="font-medium text-neutral-700 mb-1">Doctor&apos;s Notes:</p>
                        <p className="text-neutral-600">{consultation.notes}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200 flex gap-3">
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium">View Full Details</button>
                      <button className="text-sm text-neutral-600 hover:text-neutral-700 font-medium">Download Report</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function SearchIcon() {
  return (
    <svg className="h-4 w-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}