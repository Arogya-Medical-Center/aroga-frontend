import DashboardAppointments from './components/DashboardAppointments';


export default function Home() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to Arogya Healthcare Center</h1>
      <p className="text-neutral-700">
        This is the home page of the Arogya Healthcare Center application. Use the sidebar to navigate through different sections of the dashboard.
      </p>

  {/* Appointments section below the dashboard content */}
  <DashboardAppointments />
      
    </div>
  );
}
