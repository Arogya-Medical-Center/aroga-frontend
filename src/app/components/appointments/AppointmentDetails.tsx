import React from 'react';

export default function AppointmentDetails({ appointment, onClose, onEdit, onDelete }: any) {
  if (!appointment) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <div className="bg-white p-4 rounded shadow max-w-md w-full">
        <h2 className="font-bold mb-2">Appointment Details (placeholder)</h2>
        <div className="mb-4">Patient: {appointment.patientName}</div>
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn" onClick={() => onEdit && onEdit(appointment)}>Edit</button>
          <button className="btn btn-danger" onClick={() => onDelete && onDelete(appointment.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
