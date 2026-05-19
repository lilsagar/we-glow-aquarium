"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/components/providers/catalog-provider";
import { ProductGrid } from "@/components/product-grid";

export function HomeBestsellers() {
  const { products, ready } = useCatalog();
  const featured = products.filter((p) => p.inStock).slice(0, 6);

  if (!ready) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">Loading products…</div>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-fade-in-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Curated
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
              Bestsellers
            </h2>
            <p className="mt-2 max-w-lg text-sm text-neutral-600">
              Top-rated tanks, filters, and daily essentials.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-black transition-opacity hover:opacity-70"
          >
            Shop all products
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>
      </div>
    </section>
  );
}
