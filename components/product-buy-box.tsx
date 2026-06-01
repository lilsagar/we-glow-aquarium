"use client";

import { useState } from "react";
import type { Product } from "@/lib/types/product";
import { useCart } from "@/components/providers/cart-provider";

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);

  if (!product.inStock) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-neutral-900">Out of stock</p>
        <p className="mt-2 text-sm text-neutral-600">
          This item is temporarily unavailable. Check back soon or browse similar products.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500" htmlFor="qty">
            Quantity
          </label>
          <select
            id="qty"
            className="mt-2 block w-28 rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(product, qty);
            setFlash(true);
            window.setTimeout(() => setFlash(false), 900);
          }}
          className="rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] active:scale-95"
        >
          {flash ? "Added to bag" : "Add to bag"}
        </button>
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        Secure checkout is simulated — no payment is processed in this demo.
      </p>
    </div>
  );
}
