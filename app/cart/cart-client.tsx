"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatNpr } from "@/lib/format-npr";
import { useCart } from "@/components/providers/cart-provider";
import { ProductImage } from "@/components/product-image";
import { CartQuantityStepper } from "@/components/cart-quantity-stepper";

export function CartClient() {
  const { lines, subtotalNpr, itemCount, setQuantity, removeLine } = useCart();

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-black">Your cart is empty</p>
        <p className="mt-2 text-sm text-neutral-600">
          Browse products and tap <span className="font-semibold">Add to cart</span> to
          build an order.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-neutral-800"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lines.map((line) => (
        <div
          key={line.product.slug}
          className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
        >
          <Link
            href={`/products/${line.product.slug}`}
            className="shrink-0 overflow-hidden rounded-xl sm:w-28"
          >
            <ProductImage
              product={line.product}
              sizes="112px"
              className="rounded-xl"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${line.product.slug}`}
              className="text-base font-semibold text-black transition-opacity hover:opacity-70"
            >
              {line.product.name}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
              {line.product.shortDescription}
            </p>
            <p className="mt-2 text-sm font-medium text-black">
              {formatNpr(line.product.priceNpr)} each
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-col sm:items-end">
            <CartQuantityStepper
              quantity={line.quantity}
              onDecrease={() => setQuantity(line.product.slug, line.quantity - 1)}
              onIncrease={() => setQuantity(line.product.slug, line.quantity + 1)}
            />
            <button
              type="button"
              onClick={() => removeLine(line.product.slug)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:border-black hover:bg-neutral-50"
            >
              <Trash2 className="size-4" aria-hidden />
              Remove
            </button>
          </div>

          <div className="text-left sm:w-32 sm:text-right">
            <p className="text-sm text-neutral-500">Line total</p>
            <p className="text-lg font-bold text-black">
              {formatNpr(line.product.priceNpr * line.quantity)}
            </p>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm text-neutral-500">
            Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="text-2xl font-bold text-black">{formatNpr(subtotalNpr)}</p>
          <p className="mt-1 text-xs text-neutral-500">
            Delivery fee calculated at checkout (demo).
          </p>
        </div>
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-neutral-800"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
