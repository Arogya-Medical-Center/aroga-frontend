"use client";
import { useState } from "react";

export default function PatientProfile() {
  const [tab, setTab] = useState<"personal" | "medical" | "visits" | "prescriptions">("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Patient data (demo info)
  const [patient, setPatient] = useState({
    name: "Nethmini Jayasekara",
    dob: "2001-05-21",
    gender: "Female",
    bloodType: "B+",
    contact: "+94 76 816 2375",
    email: "nethminijayasekara@gmail.com",
    address: "C/95 Matiwalahena, Hettimulla.",
    conditions: "Hypertension",
    allergies: "None",
    medications: "Amlodipine",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-8 transition-all duration-300">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Patient Profile</h1>

      <div
        className={`bg-white p-6 rounded-xl shadow-md transition-all duration-300 ${
          showPopup ? "blur-sm" : ""
        }`}
      >
        {/* Tabs */}
        <div className="flex gap-6 border-b mb-4">
          {[
            { id: "personal", label: "Personal Details" },
            { id: "medical", label: "Medical History" },
            { id: "visits", label: "Visit History" },
            { id: "prescriptions", label: "Prescriptions" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`pb-2 ${
                tab === t.id
                  ? "border-b-2 border-green-600 text-green-700 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PERSONAL DETAILS */}
        {tab === "personal" && (
          <div className="space-y-3">
            {!isEditing ? (
              <>
                <p><b>Name:</b> {patient.name}</p>
                <p><b>Date of Birth:</b> {patient.dob}</p>
                <p><b>Gender:</b> {patient.gender}</p>
                <p><b>Blood Type:</b> {patient.bloodType}</p>
                <p><b>Contact:</b> {patient.contact}</p>
                <p><b>Email:</b> {patient.email}</p>
                <p><b>Address:</b> {patient.address}</p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Edit Details
                </button>
              </>
            ) : (
              <form className="space-y-3">
                <div>
                  <label className="block text-gray-600">Name</label>
                  <input
                    name="name"
                    value={patient.name}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={patient.dob}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Gender</label>
                  <select
                    name="gender"
                    value={patient.gender}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600">Contact</label>
                  <input
                    name="contact"
                    value={patient.contact}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Email</label>
                  <input
                    name="email"
                    value={patient.email}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-600">Address</label>
                  <textarea
                    name="address"
                    value={patient.address}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MEDICAL HISTORY */}
        {tab === "medical" && (
          <div className="space-y-1">
            <p><b>Conditions:</b> {patient.conditions}</p>
            <p><b>Allergies:</b> {patient.allergies}</p>
            <p><b>Current Medications:</b> {patient.medications}</p>
          </div>
        )}

        {/* VISIT HISTORY */}
        {tab === "visits" && (
          <ul className="list-disc pl-6 space-y-1">
            <li>2025-05-14 – Routine Check-up</li>
            <li>2025-07-01 – Blood Pressure Follow-up</li>
            <li>2025-09-20 – Lab Results Review</li>
          </ul>
        )}

        {/* PRESCRIPTIONS */}
        {tab === "prescriptions" && (
          <div>
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border-b">Date</th>
                  <th className="p-2 border-b">Medicine</th>
                  <th className="p-2 border-b">Dosage</th>
                  <th className="p-2 border-b">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b">2025-07-01</td>
                  <td className="p-2 border-b">Amlodipine</td>
                  <td className="p-2 border-b">5mg</td>
                  <td className="p-2 border-b">30 days</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">2025-09-20</td>
                  <td className="p-2 border-b">Paracetamol</td>
                  <td className="p-2 border-b">500mg</td>
                  <td className="p-2 border-b">5 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white/90 p-8 rounded-2xl shadow-2xl text-center w-[90%] max-w-sm border border-green-100 animate-popup">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 text-green-600 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Profile Updated!
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                The patient details have been successfully saved.
              </p>
              <button
                onClick={handleClosePopup}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-popup {
          animation: popup 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
