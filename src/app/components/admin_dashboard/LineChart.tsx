"use client";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", patients: 68 },
  { day: "Tue", patients: 74 },
  { day: "Wed", patients: 59 },
  { day: "Thu", patients: 80 },
  { day: "Fri", patients: 70 },
  { day: "Sat", patients: 90 },
  { day: "Sun", patients: 75 },
];

export default function LineChart() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="text-gray-700 font-medium mb-3">
        Patient Admissions This Week
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <ReLineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="patients"
            stroke="#22c55e"
            strokeWidth={3}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
