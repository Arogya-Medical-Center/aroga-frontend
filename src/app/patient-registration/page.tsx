"use client";
import { useState } from "react";

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: string;
  gender: string;
  contact: string;
  email: string;
  address: string;
  bloodType: string;
  allergies: string;
  conditions: string;
  medications: string;
}

export default function PatientRegistration() {
  const [formData, setFormData] = useState<PatientData>({
    id: "P" + Math.floor(1000 + Math.random() * 9000).toString(),
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    bloodType: "",
    allergies: "",
    conditions: "",
    medications: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true); // Show modal instead of alert
  };

  const handleClear = () => {
    setFormData({
      ...formData,
      firstName: "",
      lastName: "",
      dob: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      address: "",
      bloodType: "",
      allergies: "",
      conditions: "",
      medications: "",
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Patient Registration
      </h1>

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded-xl shadow-md space-y-6 transition-all ${
          showPopup ? "blur-sm" : ""
        }`}
      >
        {/* ------------------- PERSONAL INFORMATION ------------------- */}
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b pb-1">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Patient ID</label>
              <input
                value={formData.id}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Age</label>
              <input
                value={formData.age}
                readOnly
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Contact</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </section>

        {/* ------------------- MEDICAL HISTORY ------------------- */}
        <section>
          <h2 className="text-lg font-semibold mb-3 border-b pb-1">
            Medical History
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Blood Type</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Blood Type</option>
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Allergies</label>
              <input
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. Penicillin, Dust"
                className="w-full border rounded p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 mb-1">
                Existing Conditions
              </label>
              <textarea
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                placeholder="e.g. Diabetes, Asthma"
                className="w-full border rounded p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-600 mb-1">
                Current Medications
              </label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                placeholder="e.g. Metformin 500mg, Amlodipine"
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </section>

        {/* ------------------- BUTTONS ------------------- */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </div>
      </form>

      {/* ------------------- POPUP MODAL ------------------- */}
      {showPopup && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center w-[90%] max-w-sm animate-fadeIn">
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
                  Patient Registered!
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  The patient has been successfully added to the system.
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
        </>
      )}

      {/* Optional animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
