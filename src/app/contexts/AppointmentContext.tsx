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

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('appointments') : null;
      if (saved) {
        setAppointments(JSON.parse(saved));
      } else {
        const initial = getInitialAppointments();
        setAppointments(initial);
      }
    } catch (err) {
      // fallback to defaults on any error
      setAppointments(getInitialAppointments());
    }
  }, []);

  // Persist appointments to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('appointments', JSON.stringify(appointments));
      }
    } catch (err) {
      // ignore storage errors
      console.warn('Failed to save appointments to localStorage', err);
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