"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Product } from "@/data/products";
import { formatNpr } from "@/lib/format-npr";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductBadges } from "@/components/product-badges";
import { ProductQuickViewModal } from "@/components/product-quick-view-modal";
import { StarRating } from "@/components/star-rating";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const delayClass =
    index % 4 === 0
      ? ""
      : index % 4 === 1
        ? "stagger-1"
        : index % 4 === 2
          ? "stagger-2"
          : "stagger-3";

  return (
    <>
      <article
        className={`group glass-card animate-scale-in ${delayClass} flex h-full flex-col overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)]`}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </Link>

          {/* Gradient overlay on hover */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10">
            <ProductBadges product={product} />
          </div>

          {/* Quick view */}
          <div className="absolute inset-x-3 bottom-3 z-10 flex translate-y-0 gap-2 opacity-100 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-white/30 sm:text-xs"
            >
              <Eye className="size-3.5 sm:size-4" aria-hidden />
              Quick view
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:gap-3.5 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            {product.category}
          </p>

          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-sm font-bold leading-snug text-black transition-colors duration-200 hover:text-neutral-600 sm:text-base"
          >
            {product.name}
          </Link>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500 sm:text-sm">
            {product.shortDescription}
          </p>

          <div className="mt-auto space-y-3 border-t border-neutral-200/80 pt-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-base font-bold tracking-tight text-black sm:text-lg">
                {formatNpr(product.priceNpr)}
              </p>
              {product.inStock ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  In stock
                </span>
              ) : null}
            </div>
            <AddToCartButton product={product} fullWidth showIcon />
          </div>
        </div>
      </article>

      <ProductQuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
