interface Appointment {
  name: string;
  doctor: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
}

const appointments: Appointment[] = [
  { name: "Achini Dileka", doctor: "Dr. Dhanushka Perera", time: "10:00 AM", status: "Confirmed" },
  { name: "Saman Perera", doctor: "Dr. Dhanushka Perera", time: "11:30 AM", status: "Pending" },
  { name: "Piyath Ransara", doctor: "Dr. Dhanushka Perera", time: "02:15 PM", status: "Pending" },
  {name: "Sumana Rathnayaka", doctor: "Dr. Dhanushka Perera", time: "03:15 PM", status: "Pending" },
  {name: "Saduni Gamage", doctor: "Dr. Dhanushka Perera", time: "04:15 PM", status: "Pending" },
  {name: "Sarath Kumara", doctor: "Dr. Dhanushka Perera", time: "05:15 PM", status: "Pending" },
  {name: "Nishi Pathirana", doctor: "Dr. Dhanushka Perera", time: "06:15 PM", status: "Pending" },
];

export default function AppointmentTable() {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-medium text-gray-700 mb-3">Upcoming Appointments</h3>
  <table className="w-full text-sm">
        <thead className="text-gray-50 ">
          <tr>
            <th className="text-left py-4">Patient Name</th>
            <th className="text-left py-4">Doctor</th>
            <th className="text-left py-4">Time</th>
            <th className="text-left py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, idx) => (
            <tr key={idx} className=" border-gray-200 hover:bg-gray-50 ">
              <td className="py-5">{a.name}</td>
              <td className="py-4">{a.doctor}</td>
              <td className="py-4">{a.time}</td>
              <td className="py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getBadgeColor(a.status)}`}
                >
                  {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
