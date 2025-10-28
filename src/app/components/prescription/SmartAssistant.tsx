"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IllnessMapping, DosageRule } from "./types";
import { Drug } from "../inventory/DrugFormModal";

const MAPPINGS_KEY = "illness_mappings";

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

type Props = {
  initialIllness?: string;
  onIllnessChangeAction?: (s: string) => void;
};

export default function SmartAssistant({ initialIllness, onIllnessChangeAction }: Props) {
  const [age, setAge] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [illness, setIllness] = useState<string>(initialIllness || "");

  const [mappings, setMappings] = useState<IllnessMapping[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>(() => loadInventory());

  useEffect(() => {
    const raw = localStorage.getItem(MAPPINGS_KEY);
    if (raw) setMappings(JSON.parse(raw));
  }, []);

  // sync with external initialIllness when it changes
  useEffect(() => {
    if (typeof initialIllness === "string" && initialIllness !== illness) {
      setIllness(initialIllness || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIllness]);

  useEffect(() => {
    setDrugs(loadInventory());
  }, []);

  const matched = useMemo(() => {
    if (!illness.trim()) return [] as IllnessMapping[];
    return mappings.filter((m) => m.illness.toLowerCase().includes(illness.toLowerCase()));
  }, [illness, mappings]);

  // notify parent when illness changes via user input (avoid update loop)

  const matchesRange = (range: { min?: number; max?: number } | undefined, value: number | "") => {
    if (range === undefined) return true;
    const v = Number(value) || 0;
    if (range.min !== undefined && v < range.min) return false;
    if (range.max !== undefined && v > range.max) return false;
    return true;
  };

  const selectRuleForPatient = (md: any): DosageRule | undefined => {
    // legacy support: if mapping used `rule` key, return it
    if ((md as any).rule) return (md as any).rule as DosageRule;
    const rules: DosageRule[] = md.rules || [];
    if (!rules.length) return undefined;
    // try to find rule that matches both age and weight
    const ageVal = age === "" ? undefined : Number(age);
    const weightVal = weight === "" ? undefined : Number(weight);
    const exact = rules.find((r) => {
      const ageOk = r.ageRange ? matchesRange(r.ageRange, ageVal ?? 0) : true;
      const weightOk = r.weightRange ? matchesRange(r.weightRange, weightVal ?? 0) : true;
      return ageOk && weightOk;
    });
    if (exact) return exact;
    // fallback to first rule
    return rules[0];
  };

  const computeDose = (rule?: DosageRule | any) => {
    if (!rule) return "—";
    const w = Number(weight) || 0;
    if (rule.type === "perKg") {
      return `${(rule.amount * w).toFixed(2)} ${rule.unit}`;
    }
    return `${rule.amount} ${rule.unit}`;
  };

  const findAlternatives = (drugId: string) => {
    const base = drugs.find((d) => d.id === drugId);
    if (!base) return [] as Drug[];
    return drugs.filter((d) => d.category === base.category && d.id !== base.id && (d.quantity ?? 0) > 0);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Smart Prescription Assistant</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-1">Age (years)</label>
          <input type="number" value={age as any} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2 border rounded text-neutral-900 placeholder:text-neutral-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-1">Weight (kg)</label>
          <input type="number" value={weight as any} onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))} className="w-full p-2 border rounded text-neutral-900 placeholder:text-neutral-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-1">Illness</label>
          <input
            value={illness}
            onChange={(e) => {
              const val = e.target.value;
              setIllness(val);
              if (onIllnessChangeAction) onIllnessChangeAction(val);
            }}
            className="w-full p-2 border rounded text-neutral-900 placeholder:text-neutral-500"
            placeholder="Type illness to get suggestions"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Suggestions</h3>
  {matched.length === 0 && <div className="text-sm text-neutral-700">No suggestions. Try selecting an illness or ensure mappings exist in the Illness Mapper.</div>}

        <div className="space-y-3">
          {matched.map((m) => (
            <div key={m.id} className="border rounded p-3">
              <div className="font-medium mb-1">{m.illness}</div>
              <div className="grid gap-2">
                {m.drugs.map((md) => {
                  const drug = drugs.find((d) => d.id === md.drugId);
                  if (!drug) return null;
                  const available = (drug.quantity ?? 0) > 0;
                  const selectedRule = selectRuleForPatient(md);
                  return (
                    <div key={md.drugId} className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{drug.name} <span className="text-xs text-neutral-700">({drug.unit})</span></div>
                        <div className="text-xs text-neutral-700">Category: {drug.category} • Stock: {drug.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{computeDose(selectedRule)}</div>
                        <div className={`text-sm ${available ? 'text-green-600' : 'text-red-600'}`}>{available ? 'In stock' : 'Out of stock'}</div>
                        {!available && (
                          <div className="mt-1 text-xs">
                            Alternatives: {findAlternatives(md.drugId).slice(0,3).map(a=>a.name).join(', ') || '—'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
