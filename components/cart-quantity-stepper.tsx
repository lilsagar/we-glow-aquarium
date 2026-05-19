"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  max?: number;
  disabled?: boolean;
};

export function CartQuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  max = 99,
  disabled = false,
}: Props) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-neutral-300 bg-white"
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="inline-flex size-9 items-center justify-center rounded-l-full text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <span
        className="min-w-[2.5rem] px-2 text-center text-sm font-semibold text-black"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
        className="inline-flex size-9 items-center justify-center rounded-r-full text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
