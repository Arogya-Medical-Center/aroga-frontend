"use client";
{/*import React from 'react';

export default function AppointmentModal({ appointment, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white p-4 rounded shadow max-w-md w-full">
        <h2 className="font-bold mb-2">Appointment Modal (placeholder)</h2>
        <div className="mb-4">{appointment ? appointment.patientName : 'New appointment'}</div>
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => onSave && onSave(appointment)}>Save</button>
        </div>
      </div>
    </div>
  );
}*/}

//'use client'; // Marks this as a client component for state management

import { useState, useEffect } from 'react';

interface AppointmentModalProps {
  appointment: {
    patientName?: string;
    doctorName?: string;
    date?: string;
    time?: string;
    duration?: string;
    type?: string;
    notes?: string;
    status?: string;
  } | null;
  onClose: () => void;
  onSave: (formData: any) => void;
}

function AppointmentModal({ appointment, onClose, onSave }: AppointmentModalProps) {
  try {
    const [formData, setFormData] = useState({
      patientName: appointment?.patientName || '',
      doctorName: appointment?.doctorName || '',
      date: appointment?.date || '',
      time: appointment?.time || '',
      duration: appointment?.duration || '30',
      type: appointment?.type || 'Check-up',
      notes: appointment?.notes || '',
      status: appointment?.status || 'scheduled'
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSave(formData);
    };

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
      <div onClick={() => onClose()} className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-transparent backdrop-blur-sm" data-name="appointment-modal" data-file="src/components/AppointmentModal.tsx">
        <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--border-color)] relative">
          <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 text-gray-200 hover:text-gray-400">
            <div className="icon-x text-xl"></div>
          </button>
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between text-2xl font-bold">
              <h2>{appointment ? 'Edit Appointment' : 'New Appointment'}</h2>
              <button onClick={onClose} className="text-black hover:text-black">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Patient Name</label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm"
                  placeholder="Enter patient name"
                 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Doctor Name</label>
                 {/*<div className="text-black text-sm font-medium">Dr. Danushka Ranasinghe</div>*/}
                <select
                  required
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2"
                >
                  
                  <option value="" className="text-black">Select doctor</option>
                  <option value="Smith" className="text-black">Dr. Smith</option>
                  <option value="Johnson" className="text-black">Dr. Johnson</option>
                  <option value="Williams" className="text-black">Dr. Williams</option>
                  <option value="Brown" className="text-black">Dr. Brown</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Time</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm"
                />
              </div>
         
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm"
                  min="15"
                  step="15"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Appointment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm"
                >
                  <option value="Check-up" className="text-sm">Check-up</option>
                  <option value="Follow-up" className="text-sm">Follow-up</option>
                  <option value="Consultation" className="text-sm">Consultation</option>
                  <option value="Emergency" className="text-sm">Emergency</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-black">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm"
                >
                  <option value="scheduled" className="text-sm">Scheduled</option>
                  <option value="pending" className="text-sm">Pending</option>
                  <option value="completed" className="text-sm">Completed</option>
                  <option value="cancelled" className="text-sm">Cancelled</option>
                
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-black">Notes / Remarks</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Add any additional notes..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6 justify-end">
              <button type="button" onClick={onClose} className="btn btn-secondary w-xs rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm py-2.5 transition-colors">Cancel</button>
              <button type="submit" className="btn btn-primary w-xs rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-sm py-2.5 transition-colors">Save Appointment</button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AppointmentModal component error:', error);
    return null;
  }
}

export default AppointmentModal;
