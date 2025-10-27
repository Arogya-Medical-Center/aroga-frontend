"use client";

import { useState, useEffect } from "react";

export type Drug = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  reorderLevel?: number;
};

type Props = {
  open: boolean;
  initial?: Partial<Drug>;
  onCancel: () => void;
  onSave: (drug: Drug) => void;
};

export default function DrugFormModal({ open, initial, onCancel, onSave }: Props) {
  const [form, setForm] = useState<Partial<Drug>>(initial || {});

  useEffect(() => {
    setForm(initial || {});
  }, [initial]);

  if (!open) return null;

  const handleChange = (k: keyof Drug, v: any) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.category) return alert("Please provide name and category");
    const newDrug: Drug = {
      id: form.id || String(Date.now()),
      name: String(form.name),
      category: String(form.category),
      quantity: Number(form.quantity || 0),
      unit: form.unit || "pcs",
      reorderLevel: Number(form.reorderLevel || 0),
    };
    onSave(newDrug);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl p-6 z-10">
        <h3 className="text-lg font-semibold text-neutral-900 mb-3">{form.id ? "Edit Drug" : "Add Drug"}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <input
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Paracetamol"
              style={{ color: '#0f172a' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <input
              value={form.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Antibiotic"
              style={{ color: '#0f172a' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
            <input
              type="number"
              value={form.quantity ?? 0}
              onChange={(e) => handleChange("quantity", Number(e.target.value))}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ color: '#0f172a' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Unit</label>
            <input
              value={form.unit || "pcs"}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ color: '#0f172a' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Reorder level</label>
            <input
              type="number"
              value={form.reorderLevel ?? 0}
              onChange={(e) => handleChange("reorderLevel", Number(e.target.value))}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ color: '#0f172a' }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-sm">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
