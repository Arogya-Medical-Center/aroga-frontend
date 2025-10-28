"use client";

import React, { useEffect, useState } from "react";

export default function AssistantSidebar({ onSelectIllnessAction }: { onSelectIllnessAction?: (s: string) => void }) {
  const [mappings, setMappings] = useState<Array<{ id: string; illness: string }>>([]);

  useEffect(() => {
    const raw = localStorage.getItem("illness_mappings");
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      setMappings((parsed || []).map((p: any) => ({ id: p.id, illness: p.illness })));
    } catch (e) {
      setMappings([]);
    }
  }, []);

  const select = (ill: string) => {
    if (onSelectIllnessAction) onSelectIllnessAction(ill);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200">
      <h3 className="text-md font-semibold mb-3">Quick illnesses</h3>
  {mappings.length === 0 && <div className="text-sm text-neutral-700">No saved illnesses. Create mappings in Illness Mapper.</div>}
      <div className="space-y-2">
        {mappings.map((m) => (
          <button key={m.id} onClick={() => select(m.illness)} className="w-full text-left px-3 py-2 bg-neutral-50 hover:bg-neutral-100 rounded border">
            <div className="font-medium text-neutral-900">{m.illness}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
