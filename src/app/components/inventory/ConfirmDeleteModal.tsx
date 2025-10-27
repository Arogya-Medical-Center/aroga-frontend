"use client";

type Props = {
  open: boolean;
  name?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ open, name, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Confirm Delete</h3>
        <p className="text-sm text-neutral-700 mb-4">Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.</p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-sm">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}
