"use client";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { dept: "Cardiology", count: 35 },
  { dept: "Neurology", count: 45 },
  { dept: "Oncology", count: 40 },
  { dept: "Pediatrics", count: 25 },
];

export default function BarChart() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="text-gray-700 font-medium mb-3">
        Appointments by Department
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <ReBarChart data={data}>
          <XAxis dataKey="dept" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#008000" radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
