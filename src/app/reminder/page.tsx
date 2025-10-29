"use client";

import { MessageSquare, Send } from "lucide-react";
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
  const [openId, setOpenId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", date: "", time: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleOpen = (tpl: typeof templates[0]) => {
    setOpenId(tpl.id);
    setForm({ name: "", date: "", time: "", message: tpl.message });
    setSent(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setOpenId(null), 1500);
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
                className="ml-4 mt-2 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow transition flex items-center gap-1"
                onClick={() => handleOpen(tpl)}
                aria-label="Send message"
              >
                <Send size={20} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          ))}
        </div>
        {/* Elegant Popup Modal */}
        {openId !== null && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setOpenId(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <MessageSquare className="text-green-500" size={22} />
                Send Reminder
              </h2>
              <form className="space-y-4" onSubmit={e => {e.preventDefault(); handleSend();}}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Patient Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg py-2 mt-2 shadow"
                >
                  Send
                </button>
              </form>
              {sent && (
                <div className="mt-4 text-green-600 text-center font-semibold">Message sent!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}