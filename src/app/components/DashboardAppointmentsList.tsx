"use client";
import React, { useContext } from 'react';
import { AppointmentContext } from '../contexts/AppointmentContext';
import { ErrorBoundary, AppointmentModal, AppointmentDetails } from './index';

export default function DashboardAppointmentsList() {
  const ctx = useContext(AppointmentContext) as any;
  if (!ctx) return null;

  const {
    appointments,
    showModal,
    setShowModal,
    showDetails,
    setShowDetails,
    selectedAppointment,
    setSelectedAppointment,
    openEditModal,
    openDetailsModal,
    handleAddAppointment,
    handleEditAppointment,
    handleDeleteAppointment,
  } = ctx;

  return (
    <ErrorBoundary>
      <section className="mt-8 bg-white rounded-lg shadow p-4 text-black">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">Appointments</h3>
          <button
            className="btn btn-primary w-xs rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-sm py-2.5 transition-colors "
            onClick={() => {
              setSelectedAppointment(null);
              setShowModal(true);
            }}
          >
           Add Appointment
          </button>
        </div>

        {(!appointments || appointments.length === 0) ? (
          <div className="text-sm text-black">No appointments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-lg font-medium  text-black">
                  <th className="py-3 text-black">Patient</th>
                  <th className="py-3 text-black">Doctor</th>
                  <th className="py-3 text-black">Date</th>
                  <th className="py-3 text-black">Time</th>
                  <th className="py-3 text-black">Status</th>
                  <th className="py-3 text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt: any) => (
                  <tr key={apt.id} className="border-t">
                    <td className="py-3 text-black">{apt.patientName || '—'}</td>
                    <td className="py-3 text-black">{apt.doctorName || '—'}</td>
                    <td className="py-3 text-black">{apt.date || '—'}</td>
                    <td className="py-3 text-black">{apt.time || '—'}</td>
                    <td className="py-3 text-black">{apt.status || 'scheduled'}</td>
                    <td className="py-3 text-black">
                      <div className="flex gap-2">
                        <button className="btn btn-sm text-blue-600 font-light" onClick={() => openDetailsModal(apt)}>View</button>
                        <button className="btn btn-sm text-green-600 font-light" onClick={() => openEditModal(apt)}>Edit</button>
                        <button className="btn btn-sm btn-danger text-red-600 font-light" onClick={() => handleDeleteAppointment(apt.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={() => { setShowModal(false); setSelectedAppointment(null); }}
            onSave={selectedAppointment ? handleEditAppointment : handleAddAppointment}
          />
        )}

        {showDetails && selectedAppointment && (
          <AppointmentDetails
            appointment={selectedAppointment}
            onClose={() => { setShowDetails(false); setSelectedAppointment(null); }}
            onEdit={() => { setShowDetails(false); openEditModal(selectedAppointment); }}
            onDelete={handleDeleteAppointment}
          />
        )}
      </section>
    </ErrorBoundary>
  );
}
