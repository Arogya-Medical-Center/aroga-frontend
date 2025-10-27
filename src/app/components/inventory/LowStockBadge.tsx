"use client";

type Props = {
  count: number;
};

export default function LowStockBadge({ count }: Props) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
      Low stock: {count}
    </span>
  );
}
