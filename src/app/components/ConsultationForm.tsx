"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrescriptionIntegration, Prescription } from "./PrescriptionIntegration";

export interface ConsultationData {
  id?: string;
  patientId: string;
  patientName: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  notes: string[];
  doctorId: string;
  doctorName: string;
  prescriptions?: string[];
}

interface ConsultationFormProps {
  patientId?: string;
  patientName?: string;
  onSubmit: (data: ConsultationData) => void;
  onCancel?: () => void;
  initialData?: Partial<ConsultationData>;
}

export default function ConsultationForm({
  patientId = "",
  patientName = "",
  onSubmit,
  onCancel,
  initialData,
}: ConsultationFormProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<ConsultationData>({
    patientId: initialData?.patientId || patientId || "PAT004",
    patientName: initialData?.patientName || patientName || "Alice Johnson",
    date: initialData?.date || "",
    symptoms: initialData?.symptoms || [
      "Persistent cough for 5 days",
      "Mild fever (100.5°F)",
      "Fatigue and body aches",
      "Sore throat"
    ],
    diagnosis: initialData?.diagnosis || "Upper Respiratory Tract Infection (URTI) - likely viral etiology with secondary bacterial component. Patient presents with classic symptoms of respiratory infection.",
    treatment: initialData?.treatment || "Symptomatic treatment with rest, hydration, and monitoring. Prescribed antibiotics for potential bacterial component. Patient advised to follow up in 3-5 days if symptoms persist or worsen. Complete bed rest for 48 hours recommended.",
    notes: initialData?.notes || [
      "Patient has no known drug allergies",
      "Vital signs: BP 120/80, Temp 100.5°F, HR 88 bpm",
      "No recent travel history or COVID exposure",
      "Recommend isolation for 48 hours after fever subsides"
    ],
    doctorId: initialData?.doctorId || "DOC001", // This should come from auth context
    doctorName: initialData?.doctorName || "Dr. Danushka Ranasinghe", // This should come from auth context
    prescriptions: initialData?.prescriptions || [],
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    // Set today's date only on client side
    if (!initialData?.date) {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [initialData?.date]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty symptoms and notes, include prescriptions
      const cleanedData = {
        ...formData,
        symptoms: formData.symptoms.filter(symptom => symptom.trim() !== ""),
        notes: formData.notes.filter(note => note.trim() !== ""),
        prescriptions: prescriptions.map(p => `${p.medicationName} ${p.dosage} - ${p.frequency}`),
      };

      await onSubmit(cleanedData);
    } catch (error) {
      console.error("Error submitting consultation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSymptom = () => {
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, ""]
    }));
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const updateSymptom = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map((symptom, i) => i === index ? value : symptom)
    }));
  };

  const addNote = () => {
    setFormData(prev => ({
      ...prev,
      notes: [...prev.notes, ""]
    }));
  };

  const removeNote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }));
  };

  const updateNote = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.map((note, i) => i === index ? value : note)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          {initialData ? "Update Consultation" : "New Consultation"}
        </h2>
        <p className="text-sm text-neutral-600">
          Record consultation details, symptoms, diagnosis, and treatment plan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-neutral-700 mb-2">
              Patient ID *
            </label>
            <input
              type="text"
              id="patientId"
              value={formData.patientId}
              onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-neutral-700 mb-2">
              Patient Name *
            </label>
            <input
              type="text"
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
              required
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-2">
            Consultation Date *
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
            required
            suppressHydrationWarning
          />
        </div>

        {/* Symptoms */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-neutral-700">
              Symptoms *
            </label>
            <button
              type="button"
              onClick={addSymptom}
              className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Symptom
            </button>
          </div>
          <div className="space-y-2">
            {formData.symptoms.map((symptom, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={symptom}
                  onChange={(e) => updateSymptom(index, e.target.value)}
                  placeholder={`Symptom ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                  required={index === 0}
                />
                {formData.symptoms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSymptom(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <label htmlFor="diagnosis" className="block text-sm font-medium text-neutral-700 mb-2">
            Diagnosis *
          </label>
          <textarea
            id="diagnosis"
            rows={4}
            value={formData.diagnosis}
            onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
            placeholder="Enter diagnosis details..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
            required
          />
        </div>

        {/* Treatment */}
        <div>
          <label htmlFor="treatment" className="block text-sm font-medium text-neutral-700 mb-2">
            Treatment Plan *
          </label>
          <textarea
            id="treatment"
            rows={4}
            value={formData.treatment}
            onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
            placeholder="Enter treatment plan and recommendations..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-neutral-700">
              Additional Notes
            </label>
            <button
              type="button"
              onClick={addNote}
              className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Note
            </button>
          </div>
          <div className="space-y-2">
            {formData.notes.map((note, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={note}
                  onChange={(e) => updateNote(index, e.target.value)}
                  placeholder={`Note ${index + 1}`}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                />
                {formData.notes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prescription Integration */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Prescriptions</h3>
            <button
              type="button"
              onClick={() => {
                // Create URL with consultation data as query parameters
                const params = new URLSearchParams({
                  patientId: formData.patientId,
                  patientName: formData.patientName,
                  diagnosis: formData.diagnosis,
                  symptoms: formData.symptoms.filter(s => s.trim()).join(', '),
                  treatment: formData.treatment,
                  consultationId: formData.id || 'new'
                });
                router.push(`/dashboard/prescription?${params.toString()}`);
              }}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PrescriptionIcon />
              Open Prescription
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t border-neutral-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            {isSubmitting ? "Saving..." : (initialData ? "Update Consultation" : "Save Consultation")}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-neutral-300 text-neutral-700 font-medium rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function PrescriptionIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "h-4 w-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}