"use client";
import { useState } from "react";

export default function PatientProfile() {
  const [tab, setTab] = useState<"personal" | "medical" | "visits" | "prescriptions">("personal");
  const [isEditing, setIsEditing] = useState(false);

  // Patient data (mock demo info)
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
    alert("✅ Patient details updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Patient Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
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
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
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
                    className="bg-green-600 text-white px-4 py-2 rounded"
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
    </div>
  );
}