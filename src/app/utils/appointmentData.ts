// Helper: produce a YYYY-MM-DD string using the local date (avoid UTC shift)
function localDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getInitialAppointments() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: '1',
      patientName: 'John Smith',
      doctorName: 'Smith',
      date: localDateString(today),
      time: '09:00',
      duration: '30',
      type: 'Check-up',
      status: 'scheduled',
      notes: 'Regular health checkup',
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      doctorName: 'Johnson',
      date: localDateString(today),
      time: '10:30',
      duration: '45',
      type: 'Consultation',
      status: 'scheduled',
      notes: 'Follow-up consultation'
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      doctorName: 'Williams',
      date: localDateString(tomorrow),
      time: '14:00',
      duration: '30',
      type: 'Follow-up',
      status: 'pending',
      notes: ''
    },
    {
      id: '4',
      patientName: 'Emily Davis',
      doctorName: 'Brown',
      date: localDateString(nextWeek),
      time: '11:00',
      duration: '60',
      type: 'Emergency',
      status: 'scheduled',
      notes: 'Urgent care required'
    },
    {
      id: '5',
      patientName: 'James Wilson',
      doctorName: 'Smith',
      date: '2025-09-15',
      time: '15:30',
      duration: '30',
      type: 'Check-up',
      status: 'completed',
      notes: 'Completed successfully'
    }
  ];
}
