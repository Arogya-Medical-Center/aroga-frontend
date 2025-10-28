"use client";
import { useContext } from 'react';
import Header from '../components/Header';
import CalendarView from '../components/appointments/CalendarView';
import AppointmentModal from '../components/appointments/AppointmentModal';
import AppointmentDetails from '../components/appointments/AppointmentDetails';
import ErrorBoundary from '../components/ErrorBoundary';
import { AppointmentContext } from '../contexts/AppointmentContext';

export default function Calendar() {
  const context = useContext(AppointmentContext);

if (!context) {
  throw new Error('AppointmentContext must be used within a provider');
}

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
} = context;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50" data-name="calendar" data-file="src/app/calendar/page.tsx">
        <Header onAddNew={() => { setSelectedAppointment(null); setShowModal(true); }} />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <CalendarView appointments={appointments} onAppointmentClick={openDetailsModal} />
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
      </div>
    </ErrorBoundary>
  );
}
