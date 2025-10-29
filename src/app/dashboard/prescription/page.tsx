"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Define TypeScript interfaces
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
}

interface Doctor {
  name: string;
  qualification: string;
  registration: string;
  hospital: string;
  contact: string;
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Mock patients database
const patientsDatabase: Patient[] = [
  {
    id: "P00128",
    name: "Sarah Williams",
    age: 35,
    gender: "Female",
    contact: "(123) 456-7895",
    address: "123 Health St, Wellness City, 12345"
  },
  {
    id: "P00127",
    name: "Michael Brown",
    age: 41,
    gender: "Male",
    contact: "(123) 456-7894",
    address: "456 Medical Ave, Health Town, 67890"
  },
  {
    id: "P00126",
    name: "Emily Williams",
    age: 28,
    gender: "Female",
    contact: "(123) 456-7893",
    address: "789 Care Blvd, Remedy City, 11223"
  }
];

export default function PrescriptionPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  // Mock data - auto-filled
  const [doctor] = useState<Doctor>({
    name: "Dr. Danushka Ranasinghe",
    qualification: "MBBS, MD (Internal Medicine)",
    registration: "SLMC/12345",
    hospital: "Aroga Healthcare Center",
    contact: "+94 77 123 4567"
  });

  const [selectedPatient, setSelectedPatient] = useState<Patient>(patientsDatabase[0]);
  const [diagnosis, setDiagnosis] = useState("Type 2 Diabetes Mellitus - Under Control");
  const [additionalNotes, setAdditionalNotes] = useState("Continue with current medication. Follow up in 1 month. Maintain healthy diet and regular exercise.");

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice Daily (BD)",
      duration: "30 days",
      instructions: "Take after meals"
    },
    {
      id: "2",
      name: "Glimepiride",
      dosage: "2mg",
      frequency: "Once Daily (OD)",
      duration: "30 days",
      instructions: "Take before breakfast"
    }
  ]);

  const [prescriptionId] = useState(`RX-${Date.now()}`);
  const [prescriptionDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [showPreview, setShowPreview] = useState(false);
  const [isPrescriptionGenerated, setIsPrescriptionGenerated] = useState(false);

  // Auto-fill form from URL parameters (consultation data)
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    const patientName = searchParams.get('patientName');
    const consultationDiagnosis = searchParams.get('diagnosis');
    const symptoms = searchParams.get('symptoms');
    const treatment = searchParams.get('treatment');
    const consultationId = searchParams.get('consultationId');

    if (patientId && patientName) {
      // Try to find existing patient or create a new one
      let patient = patientsDatabase.find(p => p.id === patientId);
      
      if (!patient) {
        // Create a temporary patient record for the form from consultation data
        patient = {
          id: patientId,
          name: patientName,
          age: 35, // Default age, can be edited manually
          gender: "Not specified", // This can be filled manually
          contact: "To be updated", // This can be filled manually
          address: "To be updated" // This can be filled manually
        };
        
        // Add to the temporary database for this session
        patientsDatabase.push(patient);
      }
      
      setSelectedPatient(patient);
    }

    if (consultationDiagnosis) {
      setDiagnosis(consultationDiagnosis);
    }

    if (symptoms || treatment) {
      let notes = [];
      if (symptoms) notes.push(`Patient symptoms: ${symptoms}`);
      if (treatment) notes.push(`Treatment plan: ${treatment}`);
      notes.push(`\nFollow up in 1 week if symptoms persist. Maintain proper medication schedule and complete the full course as prescribed.`);
      
      setAdditionalNotes(notes.join('\n\n'));
    }

    // Clear default medicines when coming from consultation
    if (patientId) {
      setMedicines([{
        id: "1",
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: ""
      }]);
    }
  }, [searchParams]);

  // Handle patient selection
  const handlePatientChange = (patientId: string) => {
    const patient = patientsDatabase.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  // Add new medicine
  const addMedicine = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    };
    setMedicines([...medicines, newMedicine]);
  };

  // Remove medicine
  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  // Update medicine
  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  // Print prescription
  const handlePrint = () => {
    window.print();
  };

  // Download as PDF
  const handleDownload = () => {
    // Trigger browser's print dialog with PDF save option
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Generate prescription
  const handleGeneratePrescription = () => {
    // Validate that required fields are filled
    const hasValidMedicines = medicines.some(med => 
      med.name.trim() && med.dosage.trim() && med.frequency.trim()
    );
    
    if (!selectedPatient.name || !diagnosis.trim() || !hasValidMedicines) {
      alert('Please fill in all required fields: Patient information, diagnosis, and at least one complete medication.');
      return;
    }

    setIsPrescriptionGenerated(true);
    alert('Prescription generated successfully! You can now view the preview.');
  };

  // Check if prescription form has enough data to show preview
  const isPrescriptionReady = () => {
    const hasBasicInfo = selectedPatient.name && diagnosis.trim();
    const hasValidMedicine = medicines.some(med => 
      med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim()
    );
    return hasBasicInfo && hasValidMedicine;
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #prescription-print-area,
          #prescription-print-area * {
            visibility: visible;
          }
          #prescription-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="p-6 bg-neutral-50 min-h-screen">
        <div className="mb-6 flex items-center justify-between no-print">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Create Prescription</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              disabled={!isPrescriptionGenerated}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                !isPrescriptionGenerated
                  ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <PrintIcon />
              Print
            </button>
            <button
              onClick={handleDownload}
              disabled={!isPrescriptionGenerated}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                !isPrescriptionGenerated
                  ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <DownloadIcon />
              Download PDF
            </button>
          </div>
        </div>

        {/* Prescription Form */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                Select Patient
              </label>
              <select 
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
                value={selectedPatient.id}
                onChange={(e) => handlePatientChange(e.target.value)}
              >
                {patientsDatabase.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} ({patient.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Prescription Date */}
            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                Date
              </label>
              <input
                type="text"
                value={prescriptionDate}
                readOnly
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900"
              />
            </div>
          </div>

          {/* Display Selected Patient Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Selected Patient Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <p><span className="font-medium">Name:</span> {selectedPatient.name}</p>
              <p><span className="font-medium">Age:</span> {selectedPatient.age} years</p>
              <p><span className="font-medium">Gender:</span> {selectedPatient.gender}</p>
              <p><span className="font-medium">Contact:</span> {selectedPatient.contact}</p>
              <p className="col-span-2"><span className="font-medium">Address:</span> {selectedPatient.address}</p>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              Diagnosis
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter diagnosis"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
            />
          </div>

          {/* Medicines */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-neutral-800">
                Medications
              </label>
              <button
                onClick={addMedicine}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium text-sm transition-colors"
              >
                <PlusIcon />
                Add Medicine
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((medicine, index) => (
                <div key={medicine.id} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-700">Medicine {index + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        onClick={() => removeMedicine(medicine.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
                    />
                    <select
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(medicine.id, 'frequency', e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
                    >
                      <option value="">Select Frequency</option>
                      <option value="Once Daily (OD)">Once Daily (OD)</option>
                      <option value="Twice Daily (BD)">Twice Daily (BD)</option>
                      <option value="Three Times Daily (TDS)">Three Times Daily (TDS)</option>
                      <option value="Four Times Daily (QID)">Four Times Daily (QID)</option>
                      <option value="As Needed (PRN)">As Needed (PRN)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Duration (e.g., 7 days)"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                      className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Instructions (e.g., After meals)"
                      value={medicine.instructions}
                      onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                      className="md:col-span-2 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              Additional Notes / Instructions
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Enter any additional notes or instructions for the patient"
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-neutral-900"
            />
          </div>

          {/* Generate Prescription and Preview Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-neutral-200">
            <button
              onClick={handleGeneratePrescription}
              disabled={isPrescriptionGenerated}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
                isPrescriptionGenerated
                  ? 'bg-green-100 text-green-800 border border-green-300 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
              }`}
            >
              <GenerateIcon />
              {isPrescriptionGenerated ? '✓ Prescription Generated' : 'Generate Prescription'}
            </button>
            
            <button
              onClick={() => isPrescriptionGenerated && setShowPreview(!showPreview)}
              disabled={!isPrescriptionGenerated}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
                !isPrescriptionGenerated 
                  ? 'bg-gray-400 text-gray-300 cursor-not-allowed' 
                  : showPreview 
                    ? 'bg-gray-600 text-white hover:bg-gray-700' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <PreviewIcon />
              {showPreview ? 'Hide Preview' : 'Preview Prescription'}
            </button>
          </div>
        </div>

        {/* Prescription Preview (for printing) */}
        {showPreview && isPrescriptionGenerated && (
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          {!isPrescriptionReady() ? (
            <>
              <h2 className="text-xl font-bold text-neutral-700 mb-4 no-print">Prescription Preview</h2>
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 text-neutral-400 mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <p className="text-neutral-600 text-lg mb-2">Fill out prescription details to see preview</p>
                <p className="text-neutral-500 text-sm">Complete patient information, diagnosis, and at least one medication to generate the prescription preview.</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-neutral-900 mb-4 no-print">Prescription Preview</h2>
          
          <div id="prescription-print-area" ref={printRef} className="border-2 border-neutral-300 rounded-lg p-8 bg-white">
            {/* Header */}
            <div className="text-center border-b-2 border-neutral-800 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-green-600 mb-2">Aroga Healthcare Center</h1>
              <p className="text-sm text-neutral-700">123 Medical Street, Health City, Sri Lanka</p>
              <p className="text-sm text-neutral-700">Tel: +94 77 123 4567 | Email: info@aroga.lk</p>
            </div>

            {/* Doctor Info */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-2">{doctor.name}</h2>
              <p className="text-sm text-neutral-700">{doctor.qualification}</p>
              <p className="text-sm text-neutral-700">Reg. No: {doctor.registration}</p>
            </div>

            {/* Prescription Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-neutral-700"><span className="font-semibold">Prescription ID:</span> {prescriptionId}</p>
                <p className="text-neutral-700"><span className="font-semibold">Date:</span> {prescriptionDate}</p>
              </div>
              <div>
                <p className="text-neutral-700"><span className="font-semibold">Patient ID:</span> {selectedPatient.id}</p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="mb-6 border border-neutral-300 rounded-lg p-4 bg-neutral-50">
              <h3 className="font-bold text-neutral-900 mb-2 text-sm">Patient Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-neutral-700"><span className="font-semibold">Name:</span> {selectedPatient.name}</p>
                <p className="text-neutral-700"><span className="font-semibold">Age/Gender:</span> {selectedPatient.age} years / {selectedPatient.gender}</p>
                <p className="text-neutral-700"><span className="font-semibold">Contact:</span> {selectedPatient.contact}</p>
                <p className="text-neutral-700 col-span-2"><span className="font-semibold">Address:</span> {selectedPatient.address}</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-6">
              <h3 className="font-bold text-neutral-900 mb-2 text-sm border-b border-neutral-300 pb-1">Diagnosis</h3>
              <p className="text-neutral-700 text-sm">{diagnosis}</p>
            </div>

            {/* Medications */}
            <div className="mb-6">
              <h3 className="font-bold text-neutral-900 mb-2 text-sm border-b border-neutral-300 pb-1">Rx (Prescription)</h3>
              <table className="w-full text-sm border-collapse">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="border border-neutral-300 px-3 py-2 text-left">#</th>
                    <th className="border border-neutral-300 px-3 py-2 text-left">Medicine</th>
                    <th className="border border-neutral-300 px-3 py-2 text-left">Dosage</th>
                    <th className="border border-neutral-300 px-3 py-2 text-left">Frequency</th>
                    <th className="border border-neutral-300 px-3 py-2 text-left">Duration</th>
                    <th className="border border-neutral-300 px-3 py-2 text-left">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, index) => (
                    <tr key={medicine.id}>
                      <td className="border border-neutral-300 px-3 py-2">{index + 1}</td>
                      <td className="border border-neutral-300 px-3 py-2 font-medium">{medicine.name}</td>
                      <td className="border border-neutral-300 px-3 py-2">{medicine.dosage}</td>
                      <td className="border border-neutral-300 px-3 py-2">{medicine.frequency}</td>
                      <td className="border border-neutral-300 px-3 py-2">{medicine.duration}</td>
                      <td className="border border-neutral-300 px-3 py-2">{medicine.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Additional Notes */}
            {additionalNotes && (
              <div className="mb-6">
                <h3 className="font-bold text-neutral-900 mb-2 text-sm border-b border-neutral-300 pb-1">Additional Instructions</h3>
                <p className="text-neutral-700 text-sm">{additionalNotes}</p>
              </div>
            )}

            {/* Signature */}
            <div className="mt-12 text-right">
              <div className="inline-block">
                <div className="border-t-2 border-neutral-800 pt-2 w-48">
                  <p className="text-sm font-semibold text-neutral-900">{doctor.name}</p>
                  <p className="text-xs text-neutral-600">{doctor.qualification}</p>
                  <p className="text-xs text-neutral-600">Reg. No: {doctor.registration}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-neutral-300 text-center text-xs text-neutral-600">
              <p>This is a computer-generated prescription and is valid without signature</p>
              <p>For any queries, please contact: {doctor.contact}</p>
            </div>
          </div>
          </>
          )}
        </div>
        )}
      </div>
    </>
  );
}

// Icons
function PrintIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GenerateIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}