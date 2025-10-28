"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IllnessMapping, DosageRule } from "./types";
import { Drug } from "../inventory/DrugFormModal";

const STORAGE_KEY = "illness_mappings";

const fallbackDrugs: Drug[] = [
  { id: "D001", name: "Paracetamol", category: "Analgesic", quantity: 120, unit: "tabs" },
  { id: "D002", name: "Amoxicillin", category: "Antibiotic", quantity: 18, unit: "caps" },
  { id: "D003", name: "Salbutamol Inhaler", category: "Respiratory", quantity: 5, unit: "inhaler" },
  { id: "D004", name: "Aspirin", category: "Analgesic", quantity: 45, unit: "tabs" },
  { id: "D005", name: "Vitamin D", category: "Supplement", quantity: 200, unit: "caps" },
];

function loadInventory(): Drug[] {
  try {
    const raw = localStorage.getItem("drug_inventory");
    if (!raw) return fallbackDrugs;
    const parsed = JSON.parse(raw) as Drug[];
    return parsed.length ? parsed : fallbackDrugs;
  } catch (e) {
    return fallbackDrugs;
  }
}

function parseNumberOrUndefined(v?: string | undefined) {
  if (v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function newRange(minRaw?: string | undefined, maxRaw?: string | undefined) {
  const min = parseNumberOrUndefined(minRaw);
  const max = parseNumberOrUndefined(maxRaw);
  if (min === undefined && max === undefined) return undefined;
  return { ...(min !== undefined ? { min } : {}), ...(max !== undefined ? { max } : {}) };
}

const newAgeRange = newRange; // alias for clarity

export default function IllnessMapper() {
  const [mappings, setMappings] = useState<IllnessMapping[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>(() => loadInventory());

  const [illness, setIllness] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<{ drugId: string; rules: DosageRule[] }[]>([]);

  // modal state for selecting/editing rules when adding a drug to the selection
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDrug, setModalDrug] = useState<Drug | null>(null);
  const [modalTempRules, setModalTempRules] = useState<DosageRule[]>([]);
  const [modalForm, setModalForm] = useState({ type: "perKg", amount: 10, unit: "mg", frequency: "BID", minAge: "", maxAge: "", minWeight: "", maxWeight: "" });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as any[];
        // migrate old shape (drug.rule -> drug.rules)
        const migrated = parsed.map((m) => ({
          ...m,
          drugs: (m.drugs || []).map((d: any) => {
            if (d.rules) return d;
            if (d.rule) return { drugId: d.drugId, rules: [d.rule] };
            return { drugId: d.drugId, rules: d.rules || [] };
          }),
        }));
        setMappings(migrated as IllnessMapping[]);
      } catch (e) {
        // fallback
        setMappings([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  }, [mappings]);

  const addMapping = () => {
    if (!illness.trim()) return alert("Provide an illness name");
    if (!selectedDrugs.length) return alert("Select at least one drug");

    const newMapping: IllnessMapping = {
      id: String(Date.now()),
      illness: illness.trim(),
      drugs: selectedDrugs.map((sd) => ({ drugId: sd.drugId, rules: sd.rules })),
    };
    setMappings((s) => [newMapping, ...s]);
    setIllness("");
    setSelectedDrugs([]);
  };

  const openSelectionModal = (drug: Drug) => {
    // if already selected, prefill rules for editing
    const existing = selectedDrugs.find((s) => s.drugId === drug.id);
    setModalDrug(drug);
    setModalTempRules(existing ? existing.rules.slice() : []);
    setModalForm({ type: "perKg", amount: 10, unit: "mg", frequency: "BID", minAge: "", maxAge: "", minWeight: "", maxWeight: "" });
    setModalOpen(true);
  };

  const toggleDrug = (id: string) => {
    const isSelected = selectedDrugs.some((s) => s.drugId === id);
    const drug = drugs.find((d) => d.id === id);
    if (!drug) return;
    if (isSelected) {
      // unselect
      setSelectedDrugs((s) => s.filter((x) => x.drugId !== id));
    } else {
      // open modal to add rules for this drug
      openSelectionModal(drug);
    }
  };

  const removeMapping = (id: string) => {
    if (!confirm("Delete mapping?")) return;
    setMappings((s) => s.filter((m) => m.id !== id));
  };

  const updateRule = (mappingId: string, drugId: string, ruleIndex: number, rule: DosageRule) => {
    setMappings((s) =>
      s.map((m) =>
        m.id === mappingId
          ? {
              ...m,
              drugs: m.drugs.map((d) =>
                d.drugId === drugId ? { ...d, rules: d.rules.map((r, i) => (i === ruleIndex ? rule : r)) } : d
              ),
            }
          : m
      )
    );
  };

  const addRule = (mappingId: string, drugId: string, rule: DosageRule) => {
    setMappings((s) =>
      s.map((m) =>
        m.id === mappingId
          ? { ...m, drugs: m.drugs.map((d) => (d.drugId === drugId ? { ...d, rules: [...d.rules, rule] } : d)) }
          : m
      )
    );
  };

  const deleteRule = (mappingId: string, drugId: string, ruleIndex: number) => {
    setMappings((s) =>
      s.map((m) =>
        m.id === mappingId
          ? {
              ...m,
              drugs: m.drugs.map((d) =>
                d.drugId === drugId ? { ...d, rules: d.rules.filter((_, i) => i !== ruleIndex) } : d
              ),
            }
          : m
      )
    );
  };

  const categories = useMemo(() => Array.from(new Set(drugs.map((d) => d.category))), [drugs]);

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Illness → Drug Mapping</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-900 mb-1">Illness name</label>
          <input value={illness} onChange={(e) => setIllness(e.target.value)} className="w-full p-2 border rounded text-neutral-900 placeholder:text-neutral-500" placeholder="e.g. Seasonal Flu" />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-1">Actions</label>
          <div className="flex gap-2">
            <button onClick={addMapping} className="px-3 py-2 bg-green-600 text-white rounded">Add Mapping</button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-900 mb-2">Select drugs to map</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {drugs.map((d) => (
            <label key={d.id} className="flex items-center gap-2 p-2 border rounded">
              <input type="checkbox" checked={selectedDrugs.some((s) => s.drugId === d.id)} onChange={() => toggleDrug(d.id)} />
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-neutral-700">{d.category} • {d.quantity} {d.unit}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Existing Mappings</h3>
        <div className="space-y-3">
          {mappings.length === 0 && <div className="text-sm text-neutral-700">No mappings yet.</div>}
          {mappings.map((m) => (
            <div key={m.id} className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{m.illness}</div>
                <div className="text-sm text-neutral-700">{m.drugs.length} drugs</div>
              </div>
              <div className="grid gap-2">
                {m.drugs.map((md) => {
                  const drug = drugs.find((x) => x.id === md.drugId);
                  if (!drug) return null;
                  return (
                    <div key={md.drugId} className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{drug.name}</div>
                        <div className="text-xs text-neutral-700">{drug.category} • {drug.quantity} {drug.unit}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="space-y-1">
                          {md.rules.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-2">
                              <div className="text-sm">{r.type === "perKg" ? `${r.amount}${r.unit}/kg ${r.frequency || ""}` : `${r.amount}${r.unit} ${r.frequency || ""}`}</div>
                              <button className="text-sm text-blue-600" onClick={() => {
                                const newAmount = Number(prompt("Amount", String(r.amount)) || r.amount);
                                const newUnit = prompt("Unit", r.unit) || r.unit;
                                const newFreq = prompt("Frequency (e.g. OD, BID)", r.frequency || "") || r.frequency;
                                const newType = confirm("Use perKg dosing? OK = perKg, Cancel = fixed") ? "perKg" : "fixed";
                                const minAgeRaw = prompt("Min age (leave empty if none)", (r.ageRange && r.ageRange.min) ? String(r.ageRange.min) : "") || undefined;
                                const maxAgeRaw = prompt("Max age (leave empty if none)", (r.ageRange && r.ageRange.max) ? String(r.ageRange.max) : "") || undefined;
                                const minWeightRaw = prompt("Min weight kg (leave empty if none)", (r.weightRange && r.weightRange.min) ? String(r.weightRange.min) : "") || undefined;
                                const maxWeightRaw = prompt("Max weight kg (leave empty if none)", (r.weightRange && r.weightRange.max) ? String(r.weightRange.max) : "") || undefined;
                                const newRule: DosageRule = {
                                  type: newType as any,
                                  amount: newAmount,
                                  unit: newUnit,
                                  frequency: newFreq,
                                  ageRange: newAgeRange(minAgeRaw, maxAgeRaw),
                                  weightRange: newRange(minWeightRaw, maxWeightRaw),
                                } as DosageRule;
                                updateRule(m.id, md.drugId, ri, newRule);
                              }}>Edit</button>
                              <button className="text-sm text-red-600" onClick={() => deleteRule(m.id, md.drugId, ri)}>Delete</button>
                            </div>
                          ))}
                        </div>
                        <button className="text-sm text-green-600" onClick={() => {
                          const newAmount = Number(prompt("Amount", "10") || 10);
                          const newUnit = prompt("Unit", "mg") || "mg";
                          const newFreq = prompt("Frequency (e.g. OD, BID)", "BID") || "BID";
                          const newType = confirm("Use perKg dosing? OK = perKg, Cancel = fixed") ? "perKg" : "fixed";
                          const minAgeRaw = prompt("Min age (leave empty if none)", "") || undefined;
                          const maxAgeRaw = prompt("Max age (leave empty if none)", "") || undefined;
                          const minWeightRaw = prompt("Min weight kg (leave empty if none)", "") || undefined;
                          const maxWeightRaw = prompt("Max weight kg (leave empty if none)", "") || undefined;
                          const newRule: DosageRule = {
                            type: newType as any,
                            amount: newAmount,
                            unit: newUnit,
                            frequency: newFreq,
                            ageRange: newAgeRange(minAgeRaw, maxAgeRaw),
                            weightRange: newRange(minWeightRaw, maxWeightRaw),
                          } as DosageRule;
                          addRule(m.id, md.drugId, newRule);
                        }}>Add rule</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-right">
                <button onClick={() => removeMapping(m.id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-neutral-700">Tip: Define dosage rules per mapped drug (default is 10mg/kg BID). You can edit each rule after adding the mapping.</div>
      
      {/* Selection modal for adding rules when a drug is checked */}
      {modalOpen && modalDrug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-xl p-6 rounded shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add rules for {modalDrug.name}</h3>
              <button className="text-sm text-gray-600" onClick={() => setModalOpen(false)}>Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-neutral-700">Type</label>
                <select value={modalForm.type as string} onChange={(e) => setModalForm((f) => ({ ...f, type: e.target.value }))} className="w-full p-2 border rounded">
                  <option value="perKg">perKg</option>
                  <option value="fixed">fixed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-700">Amount</label>
                <input type="number" value={modalForm.amount as any} onChange={(e) => setModalForm((f) => ({ ...f, amount: Number(e.target.value) }))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-neutral-700">Unit</label>
                <input value={modalForm.unit} onChange={(e) => setModalForm((f) => ({ ...f, unit: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-neutral-700">Frequency</label>
                <input value={modalForm.frequency} onChange={(e) => setModalForm((f) => ({ ...f, frequency: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-neutral-700">Min age (years)</label>
                <input value={modalForm.minAge} onChange={(e) => setModalForm((f) => ({ ...f, minAge: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-neutral-700">Max age (years)</label>
                <input value={modalForm.maxAge} onChange={(e) => setModalForm((f) => ({ ...f, maxAge: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-neutral-700">Min weight (kg)</label>
                <input value={modalForm.minWeight} onChange={(e) => setModalForm((f) => ({ ...f, minWeight: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs text-neutral-700">Max weight (kg)</label>
                <input value={modalForm.maxWeight} onChange={(e) => setModalForm((f) => ({ ...f, maxWeight: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => {
                // add temp rule
                const r: DosageRule = {
                  type: modalForm.type as any,
                  amount: Number(modalForm.amount),
                  unit: modalForm.unit,
                  frequency: modalForm.frequency,
                  ageRange: newAgeRange(modalForm.minAge || undefined, modalForm.maxAge || undefined),
                  weightRange: newRange(modalForm.minWeight || undefined, modalForm.maxWeight || undefined),
                } as DosageRule;
                setModalTempRules((s) => [...s, r]);
              }}>Add rule</button>
              <div className="text-sm text-neutral-700">Added rules: {modalTempRules.length}</div>
            </div>

            <div className="mb-4">
              {modalTempRules.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-2 border rounded mb-2">
                  <div className="text-sm">{r.type === 'perKg' ? `${r.amount}${r.unit}/kg ${r.frequency||''}` : `${r.amount}${r.unit} ${r.frequency||''}`}</div>
                  <div className="text-xs text-neutral-600">{r.ageRange ? `age ${r.ageRange.min||'-'}-${r.ageRange.max||'-'}` : ''} {r.weightRange ? `weight ${r.weightRange.min||'-'}-${r.weightRange.max||'-'}` : ''}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => {
                if (!modalDrug) return;
                // ensure at least one rule
                const rulesToSave = modalTempRules.length ? modalTempRules : [{ type: 'perKg', amount: 10, unit: 'mg', frequency: 'BID' } as DosageRule];
                setSelectedDrugs((s) => {
                  const without = s.filter((x) => x.drugId !== modalDrug.id);
                  return [...without, { drugId: modalDrug.id, rules: rulesToSave }];
                });
                setModalOpen(false);
              }}>Save selection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
