"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  height?: number; // in cm
}

interface Consultation {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  symptoms: string;
  prescription: string;
  notes: string;
  testResults?: {
    bloodSugar?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    weight?: number;
    bmi?: number;
  };
}

// Mock data for patients - sorted by latest visit
const mockPatients: Patient[] = [
  {
    id: "P00128",
    name: "Sarah Williams",
    age: 35,
    gender: "Female",
    contact: "(123) 456-7895",
    primaryIllness: "Diabetes",
    lastVisit: "2025-10-26",
    doctor: "Dr. Danushka",
    height: 165 // cm
  },
  {
    id: "P00127",
    name: "Michael Brown",
    age: 41,
    gender: "Male",
    contact: "(123) 456-7894",
    primaryIllness: "Routine Physical",
    lastVisit: "2025-10-25",
    doctor: "Dr. Danushka",
    height: 175 // cm
  },
  {
    id: "P00126",
    name: "Emily Williams",
    age: 28,
    gender: "Female",
    contact: "(123) 456-7893",
    primaryIllness: "Hypertension",
    lastVisit: "2025-10-24",
    doctor: "Dr. Danushka",
    height: 162 // cm
  },
  {
    id: "P00125",
    name: "Robert Johnson",
    age: 58,
    gender: "Male",
    contact: "(123) 456-7892",
    primaryIllness: "Allergy Checkup",
    lastVisit: "2025-10-23",
    doctor: "Dr. Danushka",
    height: 178 // cm
  },
  {
    id: "P00124",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    contact: "(123) 456-7891",
    primaryIllness: "Migraine",
    lastVisit: "2025-10-22",
    doctor: "Dr. Danushka",
    height: 168 // cm
  },
  {
    id: "P00123",
    name: "John Doe",
    age: 45,
    gender: "Male",
    contact: "(123) 456-7890",
    primaryIllness: "Seasonal Flu",
    lastVisit: "2025-10-20",
    doctor: "Dr. Danushka",
    height: 172 // cm
  }
];

// Mock consultation history with test results
const mockConsultations: Consultation[] = [
  {
    id: "C001",
    date: "2025-10-26",
    doctor: "Dr. Danushka",
    diagnosis: "Type 2 Diabetes - Under Control",
    symptoms: "Increased thirst, frequent urination",
    prescription: "Metformin 500mg BD, Continue diet control",
    notes: "Blood sugar levels improving. Continue current medication and diet plan.",
    testResults: {
      bloodSugar: 135,
      weight: 72
    }
  },
  {
    id: "C002",
    date: "2025-09-26",
    doctor: "Dr. Danushka",
    diagnosis: "Type 2 Diabetes - Monitoring Required",
    symptoms: "Fatigue, increased hunger",
    prescription: "Metformin 500mg BD, Dietary modifications",
    notes: "Slight increase in blood sugar. Advised strict diet control.",
    testResults: {
      bloodSugar: 165,
      weight: 74
    }
  },
  {
    id: "C003",
    date: "2025-08-26",
    doctor: "Dr. Danushka",
    diagnosis: "Type 2 Diabetes - Initial Diagnosis",
    symptoms: "Increased thirst, fatigue, blurred vision",
    prescription: "Metformin 500mg BD, Diet and exercise plan",
    notes: "Newly diagnosed with Type 2 Diabetes. Started on medication.",
    testResults: {
      bloodSugar: 185,
      weight: 75
    }
  },
  {
    id: "C004",
    date: "2025-07-26",
    doctor: "Dr. Danushka",
    diagnosis: "Pre-diabetes Screening",
    symptoms: "Routine checkup",
    prescription: "Lifestyle modifications recommended",
    notes: "Blood sugar levels elevated. Recommended diet changes.",
    testResults: {
      bloodSugar: 145,
      weight: 76
    }
  }
];

// Function to calculate BMI
const calculateBMI = (weight: number, heightInCm: number): number => {
  const heightInMeters = heightInCm / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
};

// Function to get BMI category and color
const getBMICategory = (bmi: number): { category: string; color: string; bgColor: string } => {
  if (bmi < 18.5) {
    return { category: "Underweight", color: "text-blue-700", bgColor: "bg-blue-100" };
  } else if (bmi >= 18.5 && bmi < 25) {
    return { category: "Normal", color: "text-green-700", bgColor: "bg-green-100" };
  } else if (bmi >= 25 && bmi < 30) {
    return { category: "Overweight", color: "text-amber-700", bgColor: "bg-amber-100" };
  } else {
    return { category: "Obese", color: "text-red-700", bgColor: "bg-red-100" };
  }
};

export default function PatientManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showConsultationHistory, setShowConsultationHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort patients
  const filteredPatients = mockPatients.filter((patient: Patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contact.includes(searchQuery) ||
      patient.primaryIllness.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filter
    let matchesDateRange = true;
    if (filterDateRange) {
      const today = new Date();
      const visitDate = new Date(patient.lastVisit);
      
      if (filterDateRange === "today") {
        matchesDateRange = visitDate.toDateString() === today.toDateString();
      } else if (filterDateRange === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        matchesDateRange = visitDate >= weekAgo && visitDate <= today;
      } else if (filterDateRange === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        matchesDateRange = visitDate >= monthAgo && visitDate <= today;
      }
    }
    
    return matchesSearch && matchesDateRange;
  }).sort((a: Patient, b: Patient) => {
    // Sort by latest visit date (most recent first)
    return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterDateRange("");
    setCurrentPage(1);
  };

  const handleViewConsultation = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowConsultationHistory(true);
  };

  // Prepare chart data for diagnosis tracking
  const chartData = mockConsultations
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(consultation => {
      const weight = consultation.testResults?.weight || 0;
      const height = selectedPatient?.height || 165; // Default height if not available
      const calculatedBMI = weight > 0 && height > 0 ? calculateBMI(weight, height) : 0;
      
      return {
        date: consultation.date,
        bloodSugar: consultation.testResults?.bloodSugar || 0,
        weight: weight,
        bmi: calculatedBMI
      };
    });

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
                  <label className="block text-sm font-medium text-neutral-800 mb-2">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Name, Phone, Illness..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900 placeholder:text-neutral-500"
                    />
                  </div>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Primary Illness</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Last Visit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {paginatedPatients.map((patient: Patient) => (
                        <tr key={patient.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{patient.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{patient.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{patient.contact}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{patient.primaryIllness}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{patient.lastVisit}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewConsultation(patient)}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                  <div className="text-sm text-neutral-700 font-medium">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length} Entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium border-2 border-neutral-400 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-800 bg-white transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium border-2 border-neutral-400 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-800 bg-white transition-colors"
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
        /* Consultation History View with Charts */
        <div>
          <button
            onClick={() => setShowConsultationHistory(false)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
          >
            <BackIcon />
            Back to Patient List
          </button>

          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{selectedPatient?.name}</h2>
                <div className="mt-2 space-y-1 text-sm text-neutral-600">
                  <p><span className="font-medium">Patient ID:</span> {selectedPatient?.id}</p>
                  <p><span className="font-medium">Age:</span> {selectedPatient?.age} years</p>
                  <p><span className="font-medium">Gender:</span> {selectedPatient?.gender}</p>
                  <p><span className="font-medium">Contact:</span> {selectedPatient?.contact}</p>
                  <p><span className="font-medium">Primary Illness:</span> {selectedPatient?.primaryIllness}</p>
                  {selectedPatient?.height && (
                    <p><span className="font-medium">Height:</span> {selectedPatient.height} cm</p>
                  )}
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                <EditIcon />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Health Trends Charts */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Health Trends {selectedPatient?.primaryIllness === "Diabetes" ? "- Diabetes Monitoring" : "- BMI & Weight Tracking"}
            </h3>
            
            {selectedPatient?.primaryIllness === "Diabetes" && (
              <div className="mb-8">
                <h4 className="text-md font-medium text-neutral-700 mb-3">Blood Sugar Levels (mg/dL)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#374151', fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      domain={[100, 200]} 
                      tick={{ fill: '#374151', fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px'
                      }}
                      labelStyle={{ color: '#111827', fontWeight: 600 }}
                      itemStyle={{ color: '#374151' }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#374151', fontSize: '14px' }}
                      iconType="line"
                    />
                    <Line type="monotone" dataKey="bloodSugar" stroke="#16a34a" strokeWidth={3} name="Blood Sugar" dot={{ fill: '#16a34a', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-2 text-xs text-neutral-600">
                  <span className="inline-block w-3 h-3 bg-green-100 border border-green-500 mr-1"></span>
                  Normal Range: 70-140 mg/dL (fasting)
                </div>
              </div>
            )}

            {/* Weight and BMI Chart - For All Patients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-neutral-700 mb-3">Weight Tracking (kg)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#374151', fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      domain={[65, 80]} 
                      tick={{ fill: '#374151', fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px'
                      }}
                      labelStyle={{ color: '#111827', fontWeight: 600 }}
                      itemStyle={{ color: '#374151' }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#374151', fontSize: '14px' }}
                      iconType="line"
                    />
                    <Line type="monotone" dataKey="weight" stroke="#1d4ed8" strokeWidth={3} name="Weight" dot={{ fill: '#1d4ed8', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-md font-medium text-neutral-700 mb-3">BMI Tracking</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#374151', fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      domain={[20, 30]} 
                      tick={{ fill: '#374151', fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '8px'
                      }}
                      labelStyle={{ color: '#111827', fontWeight: 600 }}
                      itemStyle={{ color: '#374151' }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#374151', fontSize: '14px' }}
                      iconType="line"
                    />
                    <Line type="monotone" dataKey="bmi" stroke="#d97706" strokeWidth={3} name="BMI" dot={{ fill: '#d97706', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                    <span className="text-neutral-900 font-medium">Underweight: &lt;18.5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                    <span className="text-neutral-900 font-medium">Normal: 18.5-24.9</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
                    <span className="text-neutral-900 font-medium">Overweight: 25-29.9</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                    <span className="text-neutral-900 font-medium">Obese: ≥30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visit History */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
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

                  {/* Test Results */}
                  {consultation.testResults && (
                    <div className="border-t border-neutral-200 pt-3 mt-3">
                      <p className="font-medium text-neutral-700 mb-2 text-sm">Test Results:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {consultation.testResults.bloodSugar && (
                          <div className="bg-green-50 rounded p-2">
                            <p className="text-xs text-neutral-600">Blood Sugar</p>
                            <p className="text-lg font-semibold text-green-700">{consultation.testResults.bloodSugar} mg/dL</p>
                          </div>
                        )}
                        {consultation.testResults.weight && (
                          <div className="bg-blue-50 rounded p-2">
                            <p className="text-xs text-neutral-600">Weight</p>
                            <p className="text-lg font-semibold text-blue-700">{consultation.testResults.weight} kg</p>
                          </div>
                        )}
                        {consultation.testResults.weight && selectedPatient?.height && (
                          <div className="bg-amber-50 rounded p-2">
                            <p className="text-xs text-neutral-600">BMI (Calculated)</p>
                            <p className="text-lg font-semibold text-amber-700">
                              {calculateBMI(consultation.testResults.weight, selectedPatient.height)}
                            </p>
                            {(() => {
                              const bmi = calculateBMI(consultation.testResults.weight, selectedPatient.height);
                              const bmiInfo = getBMICategory(bmi);
                              return (
                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${bmiInfo.bgColor} ${bmiInfo.color}`}>
                                  {bmiInfo.category}
                                </span>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-neutral-200 flex gap-3">
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">View Full Details</button>
                    <button className="text-sm text-neutral-600 hover:text-neutral-700 font-medium">Download Report</button>
                  </div>
                </div>
              ))}
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