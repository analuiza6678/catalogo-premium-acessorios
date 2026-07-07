"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-rosa-bebe bg-white p-1">
      <button type="button" className="grid h-9 w-9 place-items-center rounded-full hover:bg-bege" onClick={() => onChange(Math.max(1, value - 1))}>
        <Minus size={16} />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-preto">{value}</span>
      <button type="button" className="grid h-9 w-9 place-items-center rounded-full hover:bg-bege" onClick={() => onChange(value + 1)}>
        <Plus size={16} />
      </button>
    </div>
  );
}
