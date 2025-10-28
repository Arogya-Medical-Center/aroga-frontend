import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white h-40 rounded-2xl shadow-sm hover:shadow-md transition-all p-4 flex items-center">
      {/* Icon on left */}
      <div className="mr-4 flex-shrink-0">
        <div className="rounded-2xl bg-green-100 flex items-center justify-center w-14 h-14">
          <span className="text-green-500 text-2xl">{icon}</span>
        </div>
      </div>
      {/* Title and Value on right */}
      <div className="flex flex-col justify-center items-start">
        <p className="text-lg text-green-900 font-semibold mb-2">{title}</p>
        <h2 className="text-xl font-semibold text-gray-600">{value}</h2>
      </div>
    </div>
  );
}
