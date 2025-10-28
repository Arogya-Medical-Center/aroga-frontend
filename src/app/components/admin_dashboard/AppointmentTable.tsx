import { useContext, useMemo } from 'react';
import { AppointmentContext } from '../../contexts/AppointmentContext';

type StaticAppointment = {
  name: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
};

// Render upcoming appointments from context (fallback to a small static sample if context unavailable)

export default function AppointmentTable() {
  const ctx = useContext(AppointmentContext) as any;
  const allAppointments = ctx?.appointments || [];

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const formatTime = (timeStr: string | undefined, dateStr?: string) => {
    if (!timeStr) return '';
    try {
      const datePart = dateStr || new Date().toISOString().split('T')[0];
      const d = new Date(`${datePart}T${timeStr}`);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      return timeStr || '';
    }
  };

  const prettyStatus = (s: string | undefined) => {
    if (!s) return 'Pending';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const upcoming = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return allAppointments
      .filter((a: any) => {
        if (!a?.date) return false;
        if (a.date < todayStr) return false;
        const st = (a.status || '').toLowerCase();
        if (st === 'completed' || st === 'cancelled') return false;
        return true;
      })
      .sort((x: any, y: any) => {
        const dx = `${x.date} ${x.time || ''}`;
        const dy = `${y.date} ${y.time || ''}`;
        return dx.localeCompare(dy);
      })
      .slice(0, 8)
      .map((a: any) => ({
        name: a.patientName || a.name || '-',
        doctor: a.doctorName || a.doctor || '-',
        date: a.date || '',
        time: formatTime(a.time, a.date),
        status: prettyStatus(a.status)
      } as StaticAppointment));
  }, [allAppointments]);
  

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg">Upcoming Appointments</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-green-100 to-green-50">
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Patient Name</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Doctor</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Time</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-gray-500">No upcoming appointments</td>
              </tr>
            ) : (
              upcoming.map((a: StaticAppointment, idx: number) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition`}
                >
                  <td className="py-5 px-4 rounded-l-xl text-black">{a.name}</td>
                  <td className="py-4 px-4 text-black">{a.doctor}</td>
                  <td className="py-4 px-4 text-black">{a.date}</td>
                  <td className="py-4 px-4 text-black">{a.time}</td>
                  <td className="py-4 px-4 rounded-r-xl">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getBadgeColor(a.status)}`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
