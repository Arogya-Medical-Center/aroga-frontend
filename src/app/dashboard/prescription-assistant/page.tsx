"use client";

import React from "react";
import IllnessMapper from "../../components/prescription/IllnessMapper";

export default function Page() {
  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Illness → Drug Mapping</h1>
      </div>

      <div>
        <IllnessMapper />
      </div>
    </div>
  );
}
