"use client";
import { createContext, useState, useEffect, ReactNode } from 'react';
import { getInitialAppointments } from '../utils/appointmentData';

export const AppointmentContext = createContext<{
  appointments: any[];
  setAppointments: React.Dispatch<React.SetStateAction<any[]>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAppointment: any | null;
  setSelectedAppointment: React.Dispatch<React.SetStateAction<any | null>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleAddAppointment: (appointmentData: any) => void;
  handleEditAppointment: (appointmentData: any) => void;
  handleDeleteAppointment: (id: string) => void;
  openEditModal: (appointment: any) => void;
  openDetailsModal: (appointment: any) => void;
} | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial appointments from localStorage (if present) to persist across navigations/reloads.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('appointments');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Basic validation: ensure it's an array
        if (Array.isArray(parsed)) {
          setAppointments(parsed);
          return;
        }
      }
    } catch (err) {
      // ignore and fall back to defaults
      console.error('AppointmentContext: failed to read from localStorage', err);
    }

    // fallback to seeded appointments
    setAppointments(getInitialAppointments());
  }, []);

  // Persist appointments to localStorage whenever they change so they survive reloads.
  useEffect(() => {
    try {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (err) {
      console.error('AppointmentContext: failed to save to localStorage', err);
    }
  }, [appointments]);

  const handleAddAppointment = (appointmentData: any) => {
    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      createdAt: new Date().toISOString()
    };
    setAppointments([newAppointment, ...appointments]);
    setShowModal(false);
  };

  const handleEditAppointment = (appointmentData: any) => {
    setAppointments(appointments.map(apt => 
      apt.id === selectedAppointment.id ? { ...apt, ...appointmentData } : apt
    ));
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    setShowDetails(false);
  };

  const openEditModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const openDetailsModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  return (
    <AppointmentContext.Provider value={{
      appointments,
      setAppointments,
      showModal,
      setShowModal,
      showDetails,
      setShowDetails,
      selectedAppointment,
      setSelectedAppointment,
      filterStatus,
      setFilterStatus,
      searchQuery,
      setSearchQuery,
      handleAddAppointment,
      handleEditAppointment,
      handleDeleteAppointment,
      openEditModal,
      openDetailsModal
    }}>
      {children}
    </AppointmentContext.Provider>
  );
}