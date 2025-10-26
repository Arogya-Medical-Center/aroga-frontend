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
      <section className="mt-8 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Appointments</h3>
          <button
            className="btn btn-primary text-black bg-green-400"
            onClick={() => {
              setSelectedAppointment(null);
              setShowModal(true);
            }}
          >
            Add Appointment
          </button>
        </div>

        {(!appointments || appointments.length === 0) ? (
          <div className="text-sm text-neutral-600">No appointments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-neutral-500">
                  <th className="py-2">Patient</th>
                  <th className="py-2">Doctor</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt: any) => (
                  <tr key={apt.id} className="border-t">
                    <td className="py-2">{apt.patientName || '—'}</td>
                    <td className="py-2">{apt.doctorName || '—'}</td>
                    <td className="py-2">{apt.date || '—'}</td>
                    <td className="py-2">{apt.time || '—'}</td>
                    <td className="py-2">{apt.status || 'scheduled'}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button className="btn btn-sm" onClick={() => openDetailsModal(apt)}>View</button>
                        <button className="btn btn-sm" onClick={() => openEditModal(apt)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAppointment(apt.id)}>Delete</button>
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
