'use client';

import { useEffect } from 'react';
import StatusBadge from './StateBadge';

interface AppointmentDetailsProps {
  appointment: {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    duration: string;
    type: string;
    status: string;
    notes?: string;
  };
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

function AppointmentDetails({ appointment, onClose, onEdit, onDelete }: AppointmentDetailsProps) {
  try {
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
      <div onClick={() => onClose()} className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-transparent backdrop-blur-sm" data-name="appointment-details" data-file="components/AppointmentDetails.js">
        <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border-color)] relative">
          <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <div className="icon-x text-xl"></div>
          </button>
         {/*<div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              
              <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>*/}
            <div className="p-6 border-b border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <h2 className="text-black text-2xl font-bold">Appointment Details</h2>
                <button onClick={onClose} className="text-black hover:text-black">
                  <div className="icon-x text-xl"></div>
                </button>
              </div>
            </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div>

                <div className="bg-green-300 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] bg-opacity-10 flex items-center justify-center">
                      <div className="icon-user text-lg text-[var(--primary-color)]"></div>
                    </div>
                    <div>
                      <div className="font-semibold">{appointment.patientName}</div>
                        <div className="text-sm text-black">Patient ID: #{appointment.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                  
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="icon-stethoscope text-lg text-[var(--primary-color)]"></div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">Doctor</div>
                        <div className="text-black text-sm font-medium">Dr. Danushka Ranasinghe</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="icon-calendar text-lg text-[var(--primary-color)]"></div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">Date</div>
                        <div className="text-black text-sm font-medium">{appointment.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="icon-clock text-lg text-[var(--primary-color)]"></div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">Time</div>
                        <div className="text-black text-sm font-medium">{appointment.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="icon-timer text-lg text-[var(--primary-color)]"></div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">Duration</div>
                        
                        <div className="text-black text-sm font-medium">{appointment.duration} min</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="icon-file-text text-lg text-[var(--primary-color)]"></div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">Type</div>
                        <div className="text-black text-sm font-medium">{appointment.type}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="icon-activity text-lg text-[var(--primary-color)]"></div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-secondary)]">Status</div>
                      <div className="font-medium text-sm"><StatusBadge status={appointment.status as any} /></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {appointment.notes && (
                <div>
                    <h3 className="text-sm font-semibold text-black mb-3">Notes</h3>
                    <div className="bg-green-200 p-4 rounded-lg text-sm text-black">
                    {appointment.notes}
                  </div>
                </div>
              )}
            </div>
           
            <div className="flex gap-3 mt-6 pt-6 border-t border-[var(--border-color)]">
              <button onClick={onClose} className="btn btn-secondary flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black font-medium text-sm py-2.5 transition-colors">
                Cancel
              </button>
              <button onClick={onEdit} className="btn btn-primary flex-1 flex items-center justify-center gap-2 w-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-sm py-2.5 transition-colors">
                <div className="icon-pencil text-base "></div>
                Edit Appointment
              </button>
               
              <button onClick={() => onDelete(appointment.id)} className="btn btn-danger flex-1 flex items-center justify-center gap-2 w-xs rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm py-2.5 transition-colors">
                <div className="icon-trash-2 text-base "></div>
                Delete
              </button>
              
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AppointmentDetails component error:', error);
    return null;
  }
}

export default AppointmentDetails;