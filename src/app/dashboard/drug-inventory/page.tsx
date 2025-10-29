"use client";

import React from "react";
import { useState, useMemo } from "react";
import DrugTable from "../../components/inventory/DrugTable";
import DrugFormModal, { Drug } from "../../components/inventory/DrugFormModal";
import ConfirmDeleteModal from "../../components/inventory/ConfirmDeleteModal";
import TreatmentProtocolManager from "../prescription-assistant/page";

const seed: Drug[] = [
  { id: 'D001', name: 'Paracetamol', category: 'Analgesic', quantity: 120, unit: 'tabs', reorderLevel: 20 },
  { id: 'D002', name: 'Amoxicillin', category: 'Antibiotic', quantity: 18, unit: 'caps', reorderLevel: 30 },
  { id: 'D003', name: 'Salbutamol Inhaler', category: 'Respiratory', quantity: 5, unit: 'inhaler', reorderLevel: 10 },
  { id: 'D004', name: 'Aspirin', category: 'Analgesic', quantity: 45, unit: 'tabs', reorderLevel: 20 },
  { id: 'D005', name: 'Vitamin D', category: 'Supplement', quantity: 200, unit: 'caps', reorderLevel: 50 }
];

export default function DrugInventoryPage() {
  const [items, setItems] = useState<Drug[]>(seed);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Drug | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(items.map(i=>i.category))), [items]);

  const filtered = items.filter(i => {
    const q = query.trim().toLowerCase();
    if (q && !(i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))) return false;
    if (category && i.category !== category) return false;
    return true;
  });

  const lowStockCount = items.filter(i => (i.reorderLevel ?? 0) > 0 && i.quantity <= (i.reorderLevel ?? 0)).length;

  const handleSave = (d: Drug) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === d.id);
      if (exists) return prev.map(p => p.id === d.id ? d : p);
      return [d, ...prev];
    });
    setShowForm(false);
    setEditing(undefined);
  };

  const handleEdit = (d: Drug) => {
    setEditing(d);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    setItems(prev => prev.filter(p => p.id !== deletingId));
    setDeletingId(null);
  };

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Drug Inventory</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-neutral-700">Low stock: <strong className="text-red-600">{lowStockCount}</strong></div>
          <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm">Add Drug</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white rounded-lg border border-neutral-200 p-4">
          <div className="mb-3">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or category"
                className="w-full p-2 border border-neutral-300 rounded text-neutral-900 placeholder:text-neutral-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{ color: '#0f172a' }}
              />
            </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-neutral-300 rounded text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
            >
              <option value="" style={{ color: '#0f172a' }}>All</option>
              {categories.map((c) => (
                <option key={c} value={c} style={{ color: '#0f172a' }}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-3">
          <DrugTable items={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      {/* Treatment Protocols Section */}
      <TreatmentProtocolManager />

      <DrugFormModal open={showForm} initial={editing} onCancel={()=>{setShowForm(false); setEditing(undefined)}} onSave={handleSave} />
      <ConfirmDeleteModal open={!!deletingId} name={items.find(i=>i.id===deletingId)?.name} onCancel={()=>setDeletingId(null)} onConfirm={confirmDelete} />
    </div>
  );
}
