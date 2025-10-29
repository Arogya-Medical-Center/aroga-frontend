"use client";
import StatCard from "../../components/admin_dashboard/StatCard";
import LineChart from "../../components/admin_dashboard/LineChart";
import BarChart from "../../components/admin_dashboard/BarChart";
import AppointmentTable from "../../components/admin_dashboard/AppointmentTable";
import { User, DollarSign, CalendarDays, Activity } from "lucide-react";


export default function AdminDashboardPage() {
  const stats = [
  {
    title: "Total Patients",
    value: "1,234",
    icon: <User size={36} className="text-green-500" />,  
  },
  {
    title: "Total Revenue",
    value: "$543,210",
    icon: <DollarSign size={36} className="text-green-500" />,
  },
  {
    title: "Appointments Today",
    value: "45",
    icon: <CalendarDays size={36} className="text-green-500" />,
  },
  {
    title: "Total Prescriptions",
    value: "1234",
    icon: <Activity size={36} className="text-green-500" />,
  },
];



  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart />
        <BarChart />
      </div>

      {/* Appointments Table */}
      <AppointmentTable />
    </div>
  );
}
