import DashboardAppointmentsList from "../components/DashboardAppointmentsList";

export default function AppointmentsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">Appointments Dashboard</h1>
      <DashboardAppointmentsList />
    </div>
  );
}
