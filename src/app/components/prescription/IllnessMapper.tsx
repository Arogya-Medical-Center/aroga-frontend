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

function parseAgeRangeOption(opt?: string) {
  if (!opt || opt === "none") return undefined;
  const parts = opt.split("-").map((s) => s.trim());
  if (parts.length === 1) {
    const v = parseNumberOrUndefined(parts[0]);
    if (v === undefined) return undefined;
    return { min: v };
  }
  const min = parseNumberOrUndefined(parts[0]);
  const max = parseNumberOrUndefined(parts[1]);
  return { ...(min !== undefined ? { min } : {}), ...(max !== undefined ? { max } : {}) };
}

function parseRangeUnderOption(opt?: string) {
  // supports options like "none", "<20", "20-40", ">60"
  if (!opt || opt === "none") return undefined;
  if (opt.startsWith("<")) {
    const v = parseNumberOrUndefined(opt.slice(1));
    if (v === undefined) return undefined;
    return { max: v };
  }
  if (opt.startsWith(">")) {
    const v = parseNumberOrUndefined(opt.slice(1));
    if (v === undefined) return undefined;
    return { min: v };
  }
  // range like 20-40
  const parts = opt.split("-").map((s) => s.trim());
  if (parts.length === 2) {
    const min = parseNumberOrUndefined(parts[0]);
    const max = parseNumberOrUndefined(parts[1]);
    return { ...(min !== undefined ? { min } : {}), ...(max !== undefined ? { max } : {}) };
  }
  return undefined;
}

function formatRangeForDisplay(range: { min?: number; max?: number } | undefined, unit?: string) {
  if (!range) return `Any ${unit ?? ""}`.trim();
  const { min, max } = range as { min?: number; max?: number };
  if (min !== undefined && max !== undefined) return `${min}–${max} ${unit ?? ""}`.trim();
  if (min !== undefined) return `> ${min} ${unit ?? ""}`.trim();
  if (max !== undefined) return `< ${max} ${unit ?? ""}`.trim();
  return `Any ${unit ?? ""}`.trim();
}

export default function IllnessMapper() {
  const [mappings, setMappings] = useState<IllnessMapping[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>(() => loadInventory());

  const [illness, setIllness] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<{ drugId: string; rules: DosageRule[] }[]>([]);

  // modal state for selecting/editing rules when adding a drug to the selection
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDrug, setModalDrug] = useState<Drug | null>(null);
  const [modalTempRules, setModalTempRules] = useState<DosageRule[]>([]);
  const [modalForm, setModalForm] = useState({ type: "perKg", amount: 10, unit: "mg", frequency: "3 times a day", ageRange: "none", weightRange: "none" });

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
  setModalForm({ type: "perKg", amount: 10, unit: "mg", frequency: "3 times a day", ageRange: "none", weightRange: "none" });
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
      <h2 className="text-xl font-bold text-neutral-900 mb-4">Illness → Drug Treatment Protocol</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-neutral-900 mb-1">Diagnosis / Illness</label>
          <input value={illness} onChange={(e) => setIllness(e.target.value)} className="w-full p-3 border border-neutral-300 rounded text-neutral-900 font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Seasonal Flu" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-900 mb-1">Actions</label>
          <div className="flex gap-2">
            <button onClick={addMapping} className="px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Add Protocol</button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-neutral-900 mb-2">Select medications for treatment</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {drugs.map((d) => (
            <label key={d.id} className="flex items-center gap-2 p-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer">
              <input type="checkbox" checked={selectedDrugs.some((s) => s.drugId === d.id)} onChange={() => toggleDrug(d.id)} className="w-4 h-4" />
              <div>
                <div className="font-semibold text-neutral-900">{d.name}</div>
                <div className="text-xs font-medium text-neutral-600">{d.category} • {d.unit}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-neutral-900 mb-3">Existing Treatment Protocols</h3>
        <div className="space-y-3">
          {mappings.length === 0 && <div className="text-sm font-medium text-neutral-600">No treatment protocols created yet.</div>}
          {mappings.map((m) => (
            <div key={m.id} className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-lg text-neutral-900">{m.illness}</div>
                <div className="text-sm font-semibold text-neutral-700 bg-white px-3 py-1 rounded-full border border-neutral-300">{m.drugs.length} drugs</div>
              </div>
              <div className="grid gap-2">
                {m.drugs.map((md) => {
                  const drug = drugs.find((x) => x.id === md.drugId);
                  if (!drug) return null;
                  return (
                    <div key={md.drugId} className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-neutral-200">
                      <div>
                        <div className="font-bold text-neutral-900">{drug.name}</div>
                        <div className="text-xs font-semibold text-neutral-600">{drug.category} • {drug.unit}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="space-y-1">
                          {md.rules.map((r, ri) => (
                            <div key={ri} className="flex items-center gap-2">
                              <div className="text-sm font-semibold text-neutral-900">{r.type === "perKg" ? `${r.amount}${r.unit}/kg ${r.frequency || ""}` : `${r.amount}${r.unit} ${r.frequency || ""}`}</div>
                              <div className="flex gap-2 items-center">
                                <span className="text-sm font-semibold text-neutral-900 bg-blue-100 px-2 py-1 rounded border border-blue-300">{`Age: ${formatRangeForDisplay(r.ageRange, 'yrs')}`}</span>
                                <span className="text-sm font-semibold text-neutral-900 bg-amber-100 px-2 py-1 rounded border border-amber-300">{`Weight: ${formatRangeForDisplay(r.weightRange, 'kg')}`}</span>
                              </div>
                              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800" onClick={() => {
                                // open modal prefilled for editing this drug's rules
                                const drug = drugs.find((d) => d.id === md.drugId);
                                if (!drug) return;
                                // prefill modal with this drug's rules and show modal
                                setModalDrug(drug);
                                setModalTempRules(md.rules.slice());
                                setModalForm({ type: 'perKg', amount: 10, unit: 'mg', frequency: 'BID', ageRange: 'none', weightRange: 'none' });
                                setModalOpen(true);
                              }}>Edit</button>
                              <button className="text-sm font-semibold text-red-600 hover:text-red-800" onClick={() => deleteRule(m.id, md.drugId, ri)}>Delete</button>
                            </div>
                          ))}
                        </div>
                        <button className="text-sm font-semibold text-green-600 hover:text-green-800" onClick={() => {
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
              <div className="mt-3 text-right">
                <button onClick={() => removeMapping(m.id)} className="text-sm font-semibold text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded-lg hover:bg-red-50">Delete Protocol</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm font-medium text-neutral-700 bg-blue-50 p-3 rounded-lg border border-blue-200">💡 Tip: Define dosage rules per medication (default is 10mg/kg, 3 times a day). You can edit each rule after adding the protocol.</div>
      
      {/* Selection modal for adding rules when a drug is checked */}
      {modalOpen && modalDrug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-neutral-900">Add rules for {modalDrug.name}</h3>
              <button className="text-sm font-semibold text-neutral-600 hover:text-neutral-900" onClick={() => setModalOpen(false)}>Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1">Amount</label>
                <input type="number" value={modalForm.amount as any} onChange={(e) => setModalForm((f) => ({ ...f, amount: Number(e.target.value) }))} className="w-full p-2 border border-neutral-300 rounded font-medium text-neutral-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1">Unit</label>
                <input value={modalForm.unit} onChange={(e) => setModalForm((f) => ({ ...f, unit: e.target.value }))} className="w-full p-2 border border-neutral-300 rounded font-medium text-neutral-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1">Frequency</label>
                <select value={modalForm.frequency} onChange={(e) => setModalForm((f) => ({ ...f, frequency: e.target.value }))} className="w-full p-2 border border-neutral-300 rounded font-medium text-neutral-900">
                  <option value="Once a day">Once a day</option>
                  <option value="Twice a day">Twice a day</option>
                  <option value="3 times a day">3 times a day</option>
                  <option value="4 times a day">4 times a day</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="Every 12 hours">Every 12 hours</option>
                  <option value="Before meals">Before meals</option>
                  <option value="After meals">After meals</option>
                  <option value="At bedtime">At bedtime</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1">Age range</label>
                <select value={modalForm.ageRange as string} onChange={(e) => setModalForm((f) => ({ ...f, ageRange: e.target.value }))} className="w-full p-2 border border-neutral-300 rounded font-medium text-neutral-900">
                  <option value="none">Any age</option>
                  <option value="0-1">0 - 1 yr</option>
                  <option value="2-5">2 - 5 yrs</option>
                  <option value="6-12">6 - 12 yrs</option>
                  <option value="13-17">13 - 17 yrs</option>
                  <option value="18-29">18 - 29 yrs</option>
                  <option value="30-45">30 - 45 yrs</option>
                  <option value="46-60">46 - 60 yrs</option>
                  <option value="61-120">61+ yrs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-1">Weight range</label>
                <select value={modalForm.weightRange as string} onChange={(e) => setModalForm((f) => ({ ...f, weightRange: e.target.value }))} className="w-full p-2 border border-neutral-300 rounded font-medium text-neutral-900">
                  <option value="none">Any weight</option>
                  <option value={"<30"}>&lt; 30 kg</option>
                  <option value={"30-50"}>30 - 50 kg</option>
                  <option value={"51-70"}>51 - 70 kg</option>
                  <option value={">70"}>&gt; 70 kg</option>
                </select>
              </div>
              <div />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700" onClick={() => {
                // add temp rule
                const r: DosageRule = {
                  type: modalForm.type as any,
                  amount: Number(modalForm.amount),
                  unit: modalForm.unit,
                  frequency: modalForm.frequency,
                  ageRange: parseAgeRangeOption(modalForm.ageRange as string),
                  weightRange: parseRangeUnderOption(modalForm.weightRange as string),
                } as DosageRule;
                setModalTempRules((s) => [...s, r]);
              }}>Add rule</button>
              <div className="text-sm font-semibold text-neutral-900">Added rules: {modalTempRules.length}</div>
            </div>

            <div className="mb-4">
              {modalTempRules.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 border border-neutral-300 rounded-lg mb-2 bg-neutral-50">
                  <div className="text-sm font-semibold text-neutral-900">{r.type === 'perKg' ? `${r.amount}${r.unit}/kg ${r.frequency||''}` : `${r.amount}${r.unit} ${r.frequency||''}`}</div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold text-neutral-900 bg-blue-100 px-2 py-1 rounded border border-blue-300">{`Age: ${formatRangeForDisplay(r.ageRange, 'yrs')}`}</span>
                    <span className="text-sm font-semibold text-neutral-900 bg-amber-100 px-2 py-1 rounded border border-amber-300">{`Weight: ${formatRangeForDisplay(r.weightRange, 'kg')}`}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 font-semibold rounded-lg hover:bg-gray-300" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700" onClick={() => {
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
