"use client";

import { useState } from 'react';

interface CalendarViewProps {
  appointments: any[]; // Adjust to a specific Appointment type if defined
  onAppointmentClick: (appointment: any) => void; // Adjust to a specific Appointment type if defined
}

function CalendarView({ appointments, onAppointmentClick }: CalendarViewProps) {
  try {
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
      const today = new Date('2025-10-26T17:43:00+05:30'); // Set to current date and time
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Start of the week (Sunday)
      return new Date(today.setDate(diff));
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

    return (
      <div className="card" data-name="calendar-view" data-file="src/components/CalendarView.tsx">
        <div className="flex items-center justify-between mb-6">
          <h2>Weekly Schedule</h2>
          <div className="flex items-center gap-4">
            <button onClick={goToPreviousWeek} className="btn btn-secondary">
              <div className="icon-chevron-left text-base"></div>
            </button>
            <span className="font-medium">
              {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <button onClick={goToNextWeek} className="btn btn-secondary">
              <div className="icon-chevron-right text-base"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const dayAppointments = appointments.filter(apt => apt.date === dateStr);
            const isToday = dateStr === new Date('2025-10-26').toISOString().split('T')[0]; // Current date

            return (
              <div key={index} className={`border border-[var(--border-color)] rounded-lg p-3 min-h-[200px] ${isToday ? 'bg-blue-50 border-[var(--primary-color)]' : 'bg-white'}`}>
                <div className={`text-center mb-3 pb-2 border-b ${isToday ? 'border-[var(--primary-color)]' : 'border-[var(--border-color)]'}`}>
                  <div className="text-xs font-medium text-[var(--text-secondary)]">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-[var(--primary-color)]' : ''}`}>
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      onClick={() => onAppointmentClick(apt)}
                      className={`p-2 rounded cursor-pointer text-xs ${
                        apt.status === 'scheduled' ? 'bg-green-100 hover:bg-green-200' :
                        apt.status === 'pending' ? 'bg-yellow-100 hover:bg-yellow-200' :
                        apt.status === 'completed' ? 'bg-blue-100 hover:bg-blue-200' :
                        'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-medium truncate">{apt.patientName}</div>
                      <div className="text-[var(--text-secondary)] mt-1">{apt.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error('CalendarView component error:', error);
    return null;
  }
}

export default CalendarView;
