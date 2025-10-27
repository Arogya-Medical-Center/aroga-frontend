"use client";
import React, { useContext } from 'react';
import Link from 'next/link';
import { AppointmentContext } from '../contexts/AppointmentContext';
import { Header, CalendarView, AppointmentModal, AppointmentDetails, ErrorBoundary } from './index';

export default function DashboardAppointments() {
  const {
    appointments,
    showModal,
    setShowModal,
    showDetails,
    setShowDetails,
    selectedAppointment,
    setSelectedAppointment,
    handleAddAppointment,
    handleEditAppointment,
    handleDeleteAppointment,
    openEditModal,
    openDetailsModal
  } = useContext(AppointmentContext) as any;

  return (
    <ErrorBoundary>
      <section className="mt-8 bg-white border rounded p-4 text-black" data-name="dashboard-appointments">
        <Header onAddNew={() => { setSelectedAppointment(null); setShowModal(true); }} />

        <main className="max-w-7xl mx-auto px-0 py-4">
          {/* Wrap the calendar preview in a Link so clicking it navigates to the full calendar page */}
          <Link href="/calendar" className="block">
            <div className="cursor-pointer">
              <CalendarView appointments={appointments} onAppointmentClick={openDetailsModal} />
            </div>
          </Link>
        </main>

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
