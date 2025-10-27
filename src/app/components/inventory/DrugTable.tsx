"use client";

import { useState } from "react";
import { Drug } from "./DrugFormModal";
import LowStockBadge from "./LowStockBadge";

type Props = {
  items: Drug[];
  onEdit: (d: Drug) => void;
  onDelete: (id: string) => void;
};

export default function DrugTable({ items, onEdit, onDelete }: Props) {
  const lowCount = items.filter(i => (i.reorderLevel ?? 0) > 0 && i.quantity <= (i.reorderLevel ?? 0)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-700">Total drugs: <strong className="text-neutral-900">{items.length}</strong></div>
        <LowStockBadge count={lowCount} />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-neutral-200">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Reorder Level</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm font-medium text-neutral-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{item.category}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={"font-medium " + ( (item.reorderLevel ?? 0) > 0 && item.quantity <= (item.reorderLevel ?? 0) ? "text-red-600" : "text-neutral-900")}>{item.quantity}</span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-700">{item.unit || 'pcs'}</td>
                <td className="px-4 py-3 text-sm text-neutral-700">{item.reorderLevel ?? '-'}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={()=>onEdit(item)} className="text-green-600 hover:text-green-700 text-sm">Edit</button>
                    <button onClick={()=>onDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
