// Prescription Integration Components for connecting with other developers' prescription UI

export interface Prescription {
  id?: string;
  consultationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  refills: number;
  prescribedDate: string;
  doctorId: string;
  patientId: string;
}

export interface PrescriptionFormData {
  medications: Prescription[];
  generalInstructions?: string;
}

// Props interface for prescription components from other developers
export interface PrescriptionComponentProps {
  consultationId: string;
  patientId: string;
  doctorId: string;
  onPrescriptionSave: (prescriptions: PrescriptionFormData) => void;
  onPrescriptionCancel?: () => void;
  initialData?: PrescriptionFormData;
  readOnly?: boolean;
}

// Interface for prescription display components
export interface PrescriptionDisplayProps {
  prescriptions: Prescription[];
  onEdit?: (prescription: Prescription) => void;
  onDelete?: (prescriptionId: string) => void;
  showPatientInfo?: boolean;
  compact?: boolean;
}

// Hook interface for prescription management
export interface UsePrescriptionReturn {
  prescriptions: Prescription[];
  loading: boolean;
  error: string | null;
  createPrescription: (prescription: Omit<Prescription, 'id'>) => Promise<void>;
  updatePrescription: (id: string, prescription: Partial<Prescription>) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;
  getPrescriptionsByConsultation: (consultationId: string) => Promise<Prescription[]>;
  getPrescriptionsByPatient: (patientId: string) => Promise<Prescription[]>;
}

// Utility functions that other developers can use

/**
 * Format prescription for display
 */
export const formatPrescriptionDisplay = (prescription: Prescription): string => {
  return `${prescription.medicationName} ${prescription.dosage} - ${prescription.frequency} for ${prescription.duration}`;
};

/**
 * Validate prescription data
 */
export const validatePrescription = (prescription: Partial<Prescription>): string[] => {
  const errors: string[] = [];
  
  if (!prescription.medicationName?.trim()) {
    errors.push('Medication name is required');
  }
  
  if (!prescription.dosage?.trim()) {
    errors.push('Dosage is required');
  }
  
  if (!prescription.frequency?.trim()) {
    errors.push('Frequency is required');
  }
  
  if (!prescription.duration?.trim()) {
    errors.push('Duration is required');
  }
  
  if (!prescription.quantity || prescription.quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }
  
  if (prescription.refills !== undefined && prescription.refills < 0) {
    errors.push('Refills cannot be negative');
  }
  
  return errors;
};

/**
 * Generate prescription ID
 */
export const generatePrescriptionId = (): string => {
  return `PRES_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Common medication suggestions
 */
export const COMMON_MEDICATIONS = [
  { name: 'Paracetamol', commonDosages: ['500mg', '650mg', '1000mg'] },
  { name: 'Ibuprofen', commonDosages: ['200mg', '400mg', '600mg'] },
  { name: 'Amoxicillin', commonDosages: ['250mg', '500mg', '875mg'] },
  { name: 'Omeprazole', commonDosages: ['20mg', '40mg'] },
  { name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'] },
  { name: 'Atorvastatin', commonDosages: ['10mg', '20mg', '40mg', '80mg'] },
  { name: 'Lisinopril', commonDosages: ['5mg', '10mg', '20mg', '40mg'] },
  { name: 'Amlodipine', commonDosages: ['2.5mg', '5mg', '10mg'] },
];

/**
 * Common frequency options
 */
export const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'As needed',
  'Before meals',
  'After meals',
  'At bedtime',
];

/**
 * Common duration options
 */
export const DURATION_OPTIONS = [
  '3 days',
  '5 days',
  '7 days',
  '10 days',
  '2 weeks',
  '3 weeks',
  '1 month',
  '2 months',
  '3 months',
  '6 months',
  'Ongoing',
];

// Event types for inter-component communication
export type PrescriptionEvent = 
  | { type: 'PRESCRIPTION_CREATED'; payload: Prescription }
  | { type: 'PRESCRIPTION_UPDATED'; payload: Prescription }
  | { type: 'PRESCRIPTION_DELETED'; payload: { id: string } }
  | { type: 'CONSULTATION_PRESCRIPTION_REQUEST'; payload: { consultationId: string } };

/**
 * Event emitter for prescription-related events
 * Other developers can subscribe to these events to sync their components
 */
class PrescriptionEventEmitter {
  private listeners: { [key: string]: Array<(event: PrescriptionEvent) => void> } = {};

  subscribe(eventType: string, callback: (event: PrescriptionEvent) => void) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    };
  }

  emit(event: PrescriptionEvent) {
    const eventListeners = this.listeners[event.type] || [];
    eventListeners.forEach(callback => callback(event));
  }
}

// Global instance for prescription events
export const prescriptionEvents = new PrescriptionEventEmitter();

// Integration helper component
export interface PrescriptionIntegrationProps {
  consultationId: string;
  patientId: string;
  doctorId: string;
  onPrescriptionChange: (prescriptions: Prescription[]) => void;
}

// This is a placeholder component that other developers can replace with their own prescription component
export function PrescriptionIntegration({
  consultationId,
  patientId,
  doctorId,
  onPrescriptionChange,
}: PrescriptionIntegrationProps) {
  // This component serves as an integration point
  // Other developers should replace this with their actual prescription component
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-blue-900">Prescription Component Integration</h3>
          <p className="text-sm text-blue-700">
            This area will be replaced with the prescription component from the prescription team.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-md p-4 border border-blue-200">
        <p className="text-sm text-neutral-600 mb-2">
          <strong>Integration Details:</strong>
        </p>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• Consultation ID: <code className="bg-neutral-100 px-2 py-1 rounded">{consultationId}</code></li>
          <li>• Patient ID: <code className="bg-neutral-100 px-2 py-1 rounded">{patientId}</code></li>
          <li>• Doctor ID: <code className="bg-neutral-100 px-2 py-1 rounded">{doctorId}</code></li>
        </ul>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>For Prescription Team:</strong> Replace this component with your prescription form/display component.
            Use the provided interfaces and event system for seamless integration.
          </p>
        </div>
      </div>
    </div>
  );
}