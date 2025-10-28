'use client';

import React, { useState } from 'react';

interface Appointment {
  id: string | number;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled' | string;
}

interface CalendarViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function CalendarView({
  appointments,
  onAppointmentClick,
}: CalendarViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    const monday = new Date(today);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  //const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatDate = (date: Date) => {
    // use local date components to avoid UTC shifts from toISOString()
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl" data-name="calendar-view">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              goToPreviousWeek();
            }}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            ◀
          </button>

          <span className="font-medium text-gray-700">
            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}-{' '}
            {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              goToNextWeek();
            }}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const dateStr = formatDate(day);
          const dayAppointments = appointments.filter((apt) => apt.date === dateStr);
          const isToday = dateStr === formatDate(new Date());

          return (
            <div
              key={index}
              className={`border rounded-lg p-3 min-h-[180px] transition ${
                isToday ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'
              }`}
            >
              {/* Date header */}
              <div className={`text-center mb-3 pb-2 border-b ${isToday ? 'border-blue-400' : 'border-gray-200'}`}>
                <div className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>{day.getDate()}</div>
              </div>

              {/* Appointments */}
              <div className="space-y-2">
                {dayAppointments.length > 0 ? (
                  dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onAppointmentClick(apt);
                      }}
                      className={`p-2 rounded-md cursor-pointer text-xs ${
                        apt.status === 'scheduled'
                          ? 'bg-green-100 hover:bg-green-200'
                          : apt.status === 'pending'
                          ? 'bg-yellow-100 hover:bg-yellow-200'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 hover:bg-blue-200'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-medium truncate text-black">{apt.patientName}</div>
                      <div className="text-gray-600 mt-1">{apt.time}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center">No Appointments</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}