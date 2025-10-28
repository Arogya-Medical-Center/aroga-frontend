"use client";

import { Bell, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function NotificationPage() {
  const notifications = [
    {
      id: 1,
      title: "New Patient Added",
      message: "A new patient record has been successfully added.",
      time: "2 minutes ago",
      icon: <CheckCircle className="text-green-500" size={20} />,
    },
    {
      id: 2,
      title: "Appointment Reminder",
      message: "You have an appointment scheduled at 3:00 PM.",
      time: "1 hour ago",
      icon: <Bell className="text-blue-500" size={20} />,
    },
    {
      id: 3,
      title: "Low Bed Availability",
      message: "Only 2 beds remaining in Ward 3.",
      time: "3 hours ago",
      icon: <AlertTriangle className="text-yellow-500" size={20} />,
    },
    {
      id: 4,
      title: "System Maintenance",
      message: "The system will be offline for maintenance at 10 PM.",
      time: "1 day ago",
      icon: <Clock className="text-gray-500" size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Bell className="text-green-500" size={26} />
          Notifications
        </h1>

        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-4 border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="p-2 bg-gray-100 rounded-full">{n.icon}</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{n.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <span className="text-xs text-gray-400 mt-2 block">{n.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
