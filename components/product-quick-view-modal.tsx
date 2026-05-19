"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { formatNpr } from "@/lib/format-npr";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductBadges } from "@/components/product-badges";
import { StarRating } from "@/components/star-rating";

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export function ProductQuickViewModal({ product, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        aria-label="Close quick view"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl animate-scale-in sm:max-h-[85vh] sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-black backdrop-blur-md transition-colors hover:bg-black hover:text-white"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="grid overflow-y-auto sm:grid-cols-2">
          <div className="relative aspect-square bg-neutral-100 sm:aspect-auto sm:min-h-[320px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute left-4 top-4">
              <ProductBadges product={product} />
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
              {product.category}
            </p>
            <h2 id="quick-view-title" className="text-xl font-bold tracking-tight text-black sm:text-2xl">
              {product.name}
            </h2>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            <p className="text-sm leading-relaxed text-neutral-600 line-clamp-4">
              {product.description}
            </p>
            <p className="text-2xl font-bold tracking-tight text-black">
              {formatNpr(product.priceNpr)}
            </p>

            <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
              <AddToCartButton product={product} fullWidth className="flex-1" />
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wide text-black transition-all hover:border-black hover:bg-neutral-50"
              >
                Full details
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
