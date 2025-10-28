"use client";
import React, { useContext } from 'react';
import { AppointmentContext } from '../contexts/AppointmentContext';
import { ErrorBoundary, AppointmentModal, AppointmentDetails } from './index';

// small helper to render status as a colored pill button (matches Upcoming table style)
const getBadgeClasses = (status: string | undefined) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'scheduled':
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'completed':
      return 'bg-blue-100 text-blue-700';
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const prettyStatus = (s: string | undefined) => {
  if (!s) return 'Pending';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function StatusPill({ status }: { status?: string }) {
  return (
    <button
      type="button"
      aria-label={`appointment-status-${status}`}
      className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm focus:outline-none ${getBadgeClasses(status)}`}
    >
      {prettyStatus(status)}
    </button>
  );
}

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
          <h3 className="text-lg font-semibold text-black">Appointments</h3>
          <button
            className="btn btn-primary w-xs rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-sm py-2.5 transition-colors"
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
            <table className="w-full text-sm rounded-xl overflow-hidden">
              <thead>
                <tr className="text-lg text-black">
                  <th className="py-4 px-4 text-left text-black">Patient</th>
                  <th className="py-4 px-4 text-left text-black">Doctor</th>
                  <th className="py-4 px-4 text-left text-black">Date</th>
                  <th className="py-4 px-4 text-left text-black">Time</th>
                  <th className="py-4 px-4 text-left text-black">Status</th>
                  <th className="py-4 px-4 text-left text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt: any, idx: number) => (
                  <tr
                    key={apt.id}
                    className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition`}
                  >
                    <td className="py-5 px-4 rounded-l-xl text-black">{apt.patientName || '—'}</td>
                    <td className="py-4 px-4 text-black">{apt.doctorName || '—'}</td>
                    <td className="py-4 px-4 text-black">{apt.date || '—'}</td>
                    <td className="py-4 px-4 text-black">{apt.time || '—'}</td>
                    <td className="py-4 px-4 text-black rounded-r-xl">
                      {/* status as small colored button like the upcoming appointments table */}
                      <StatusPill status={apt.status || 'scheduled'} />
                    </td>
                    <td className="py-2 px-4 text-black"> 
                      <div className="flex gap-2">
                        <button className="btn btn-sm text-blue-500" onClick={() => openDetailsModal(apt)}>View</button>
                        <button className="btn btn-sm text-green-500" onClick={() => openEditModal(apt)}>Edit</button>
                        <button className="btn btn-sm btn-danger text-red-500" onClick={() => handleDeleteAppointment(apt.id)}>Delete</button>
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
