"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { useCart } from "@/components/providers/cart-provider";

export function AddToCartButton({
  product,
  className = "",
  fullWidth = false,
  showIcon = false,
}: {
  product: Product;
  className?: string;
  fullWidth?: boolean;
  showIcon?: boolean;
}) {
  const { addItem } = useCart();
  const [flash, setFlash] = useState(false);

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 active:scale-[0.98]";

  if (!product.inStock) {
    return (
      <button
        type="button"
        disabled
        className={`${base} bg-neutral-200 px-4 py-2.5 text-neutral-500 ${fullWidth ? "w-full" : ""} ${className}`}
      >
        Sold out
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
        setFlash(true);
        window.setTimeout(() => setFlash(false), 900);
      }}
      className={`${base} bg-black px-4 py-2.5 text-white shadow-sm hover:bg-neutral-800 hover:shadow-md hover:scale-[1.02] ${fullWidth ? "w-full py-3" : ""} ${className}`}
    >
      {showIcon ? <ShoppingBag className="size-4" aria-hidden /> : null}
      {flash ? "Added" : "Add to cart"}
    </button>
  );
}
