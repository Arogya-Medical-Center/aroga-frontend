"use client";

import { ClipboardCheck, MessageSquare } from "lucide-react";
import { useState } from "react";

const templates = [
  {
    id: 1,
    title: "Appointment Reminder",
    message:
      "Dear [Patient Name], this is a reminder for your appointment at [Time] on [Date]. Please arrive 10 minutes early.",
  },
  {
    id: 2,
    title: "Follow-up Reminder",
    message:
      "Hello [Patient Name], don't forget your follow-up appointment scheduled for [Date]. We look forward to seeing you!",
  },
  {
    id: 3,
    title: "Medication Reminder",
    message:
      "Hi [Patient Name], please remember to take your medication as prescribed. Contact us if you have any questions.",
  },
  {
    id: 4,
    title: "Health Check Reminder",
    message:
      "Dear [Patient Name], it's time for your routine health check. Book your appointment at your convenience.",
  },
];

export default function ReminderTemplatesPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (msg: string, id: number) => {
    navigator.clipboard.writeText(msg);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <MessageSquare className="text-green-500" size={28} />
          Message Templates for Reminders
        </h1>
        <div className="space-y-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="border border-gray-200 rounded-xl p-5 shadow-sm flex items-start gap-4 bg-gray-50 hover:shadow-md transition"
            >
              <div className="flex flex-col items-center justify-center pt-1">
                <MessageSquare className="text-green-400" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{tpl.title}</h2>
                <p className="text-gray-600 text-sm">{tpl.message}</p>
              </div>
              <button
                className="ml-4 mt-2 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow transition"
                onClick={() => handleCopy(tpl.message, tpl.id)}
                aria-label="Copy message"
              >
                {copiedId === tpl.id ? (
                  <ClipboardCheck className="text-white" size={20} />
                ) : (
                  <ClipboardCheck className="text-white opacity-70" size={20} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}