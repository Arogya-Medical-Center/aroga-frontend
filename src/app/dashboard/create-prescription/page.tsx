"use client";

import React, { useState, useEffect, useMemo } from "react";
import { IllnessMapping, DosageRule } from "../../components/prescription/types";
import { Drug } from "../../components/inventory/DrugFormModal";

// Patient interface matching the patients page
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

interface PrescriptionItem {
  drugId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const MAPPINGS_KEY = "illness_mappings";

// Mock patients data - in production, this would come from API/localStorage
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
    height: 165
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
    height: 175
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
    height: 162
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
    height: 178
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
    height: 168
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
    height: 172
  }
];

const fallbackDrugs: Drug[] = [
  { id: "D001", name: "Paracetamol", category: "Analgesic", quantity: 120, unit: "tabs" },
  { id: "D002", name: "Amoxicillin", category: "Antibiotic", quantity: 18, unit: "caps" },
  { id: "D003", name: "Salbutamol Inhaler", category: "Respiratory", quantity: 5, unit: "inhaler" },
  { id: "D004", name: "Aspirin", category: "Analgesic", quantity: 45, unit: "tabs" },
  { id: "D005", name: "Vitamin D", category: "Supplement", quantity: 200, unit: "caps" },
];

function loadInventory(): Drug[] {
  try {
    const raw = localStorage.getItem("drug_inventory");
    if (!raw) return fallbackDrugs;
    const parsed = JSON.parse(raw) as Drug[];
    return parsed.length ? parsed : fallbackDrugs;
  } catch (e) {
    return fallbackDrugs;
  }
}

// Calculate weight from BMI if available (mock calculation)
function estimateWeight(patient: Patient): number {
  // Mock weight calculation - in production, get from patient records
  const heightInMeters = (patient.height || 170) / 100;
  const estimatedBMI = 24; // Assuming normal BMI
  return Math.round(estimatedBMI * heightInMeters * heightInMeters);
}

export default function CreatePrescriptionPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [illness, setIllness] = useState("");
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
  const [notes, setNotes] = useState("");
  const [mappings, setMappings] = useState<IllnessMapping[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>(() => loadInventory());
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(MAPPINGS_KEY);
    if (raw) setMappings(JSON.parse(raw));
  }, []);

  useEffect(() => {
    setDrugs(loadInventory());
  }, []);

  // Auto-suggest drugs when illness is typed
  const suggestedDrugs = useMemo(() => {
    if (!illness.trim() || !selectedPatient) return [];
    
    const matchedMappings = mappings.filter((m) => 
      m.illness.toLowerCase().includes(illness.toLowerCase())
    );

    if (matchedMappings.length === 0) return [];

    const patientAge = selectedPatient.age;
    const patientWeight = estimateWeight(selectedPatient);

    const suggestions: Array<{
      drug: Drug;
      dosage: string;
      frequency: string;
      rule: DosageRule;
    }> = [];

    matchedMappings.forEach((mapping) => {
      mapping.drugs.forEach((md) => {
        const drug = drugs.find((d) => d.id === md.drugId);
        if (!drug) return;

        // Find matching rule for patient's age and weight
        const matchingRule = md.rules.find((rule) => {
          const ageMatch = !rule.ageRange || 
            ((!rule.ageRange.min || patientAge >= rule.ageRange.min) &&
             (!rule.ageRange.max || patientAge <= rule.ageRange.max));
          
          const weightMatch = !rule.weightRange || 
            ((!rule.weightRange.min || patientWeight >= rule.weightRange.min) &&
             (!rule.weightRange.max || patientWeight <= rule.weightRange.max));
          
          return ageMatch && weightMatch;
        }) || md.rules[0]; // Fallback to first rule

        if (matchingRule) {
          const dosageAmount = matchingRule.type === "perKg" 
            ? (matchingRule.amount * patientWeight).toFixed(2)
            : matchingRule.amount.toString();
          
          suggestions.push({
            drug,
            dosage: `${dosageAmount} ${matchingRule.unit}`,
            frequency: matchingRule.frequency || "As directed",
            rule: matchingRule
          });
        }
      });
    });

    return suggestions;
  }, [illness, selectedPatient, mappings, drugs]);

  useEffect(() => {
    if (suggestedDrugs.length > 0 && illness.trim()) {
      setShowSuggestions(true);
    }
  }, [suggestedDrugs, illness]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setIllness(patient.primaryIllness); // Pre-fill with primary illness
  };

  const addSuggestedDrug = (suggestion: typeof suggestedDrugs[0]) => {
    const exists = prescriptionItems.some(item => item.drugId === suggestion.drug.id);
    if (exists) {
      alert("This drug is already in the prescription");
      return;
    }

    const newItem: PrescriptionItem = {
      drugId: suggestion.drug.id,
      drugName: suggestion.drug.name,
      dosage: suggestion.dosage,
      frequency: suggestion.frequency,
      duration: "7 days",
      instructions: "Take after meals"
    };

    setPrescriptionItems([...prescriptionItems, newItem]);
    setShowSuggestions(false);
  };

  const addManualDrug = () => {
    const newItem: PrescriptionItem = {
      drugId: `MANUAL-${Date.now()}`,
      drugName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    };
    setPrescriptionItems([...prescriptionItems, newItem]);
  };

  const updatePrescriptionItem = (index: number, field: keyof PrescriptionItem, value: string) => {
    const updated = [...prescriptionItems];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptionItems(updated);
  };

  const removePrescriptionItem = (index: number) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };

  const handleSavePrescription = () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    if (prescriptionItems.length === 0) {
      alert("Please add at least one medication");
      return;
    }

    // Save prescription to localStorage (in production, send to API)
    const prescription = {
      id: `RX-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      date: new Date().toISOString().split('T')[0],
      illness,
      items: prescriptionItems,
      notes,
      doctor: "Dr. Danushka"
    };

    const existingPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    localStorage.setItem("prescriptions", JSON.stringify([prescription, ...existingPrescriptions]));

    alert("Prescription saved successfully!");
    
    // Reset form
    setSelectedPatient(null);
    setIllness("");
    setPrescriptionItems([]);
    setNotes("");
  };

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Create Prescription</h1>
        <button
          onClick={() => window.location.href = '/dashboard/patients'}
          className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded-lg hover:bg-green-50"
        >
          View Patients
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Select Patient</h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mockPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPatient?.id === patient.id
                      ? "bg-green-50 border-green-500"
                      : "bg-white border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="font-medium text-neutral-900">{patient.name}</div>
                  <div className="text-xs text-neutral-600 mt-1">
                    ID: {patient.id} • Age: {patient.age} • {patient.gender}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {patient.primaryIllness}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          {selectedPatient && (
            <div className="bg-white rounded-lg border border-neutral-200 p-6 mt-4">
              <h3 className="text-md font-semibold text-neutral-900 mb-3">Patient Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Age:</span>
                  <span className="font-medium text-neutral-900">{selectedPatient.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Weight (est):</span>
                  <span className="font-medium text-neutral-900">{estimateWeight(selectedPatient)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Height:</span>
                  <span className="font-medium text-neutral-900">{selectedPatient.height || 'N/A'} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Contact:</span>
                  <span className="font-medium text-neutral-900">{selectedPatient.contact}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prescription Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Prescription Details</h2>

            {!selectedPatient && (
              <div className="text-center py-8 text-neutral-500">
                Please select a patient to create a prescription
              </div>
            )}

            {selectedPatient && (
              <>
                {/* Illness Input with Auto-suggestions */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Diagnosis / Illness
                  </label>
                  <input
                    type="text"
                    value={illness}
                    onChange={(e) => setIllness(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full p-3 border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type illness to get drug suggestions..."
                  />

                  {/* Auto-suggestions dropdown */}
                  {showSuggestions && suggestedDrugs.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-3 border-b border-neutral-200 bg-green-50">
                        <div className="text-sm font-semibold text-green-800">
                          Suggested Medications (based on age & weight)
                        </div>
                      </div>
                      {suggestedDrugs.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => addSuggestedDrug(suggestion)}
                          className="w-full text-left p-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-neutral-900">{suggestion.drug.name}</div>
                              <div className="text-xs text-neutral-600 mt-1">
                                {suggestion.dosage} • {suggestion.frequency}
                              </div>
                              <div className="text-xs text-neutral-500 mt-1">
                                Category: {suggestion.drug.category} • Stock: {suggestion.drug.quantity} {suggestion.drug.unit}
                              </div>
                            </div>
                            <PlusIcon />
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="w-full p-2 text-sm text-neutral-600 hover:bg-neutral-50"
                      >
                        Close suggestions
                      </button>
                    </div>
                  )}
                </div>

                {/* Prescription Items */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-neutral-900">
                      Medications
                    </label>
                    <button
                      onClick={addManualDrug}
                      className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                    >
                      <PlusIcon />
                      Add Manual Entry
                    </button>
                  </div>

                  {prescriptionItems.length === 0 && (
                    <div className="text-center py-6 text-neutral-500 border border-dashed border-neutral-300 rounded-lg">
                      No medications added yet. Type an illness above to get suggestions or add manually.
                    </div>
                  )}

                  <div className="space-y-3">
                    {prescriptionItems.map((item, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              Drug Name
                            </label>
                            <input
                              type="text"
                              value={item.drugName}
                              onChange={(e) => updatePrescriptionItem(index, "drugName", e.target.value)}
                              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 text-sm"
                              placeholder="Drug name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              Dosage
                            </label>
                            <input
                              type="text"
                              value={item.dosage}
                              onChange={(e) => updatePrescriptionItem(index, "dosage", e.target.value)}
                              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 text-sm"
                              placeholder="e.g., 500mg"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              Frequency
                            </label>
                            <input
                              type="text"
                              value={item.frequency}
                              onChange={(e) => updatePrescriptionItem(index, "frequency", e.target.value)}
                              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 text-sm"
                              placeholder="e.g., BID (twice daily)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={item.duration}
                              onChange={(e) => updatePrescriptionItem(index, "duration", e.target.value)}
                              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 text-sm"
                              placeholder="e.g., 7 days"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Instructions
                          </label>
                          <input
                            type="text"
                            value={item.instructions}
                            onChange={(e) => updatePrescriptionItem(index, "instructions", e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded text-neutral-900 text-sm"
                            placeholder="e.g., Take after meals"
                          />
                        </div>
                        <button
                          onClick={() => removePrescriptionItem(index)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add any additional instructions or notes..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePrescription}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Save Prescription
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      setIllness("");
                      setPrescriptionItems([]);
                      setNotes("");
                    }}
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
