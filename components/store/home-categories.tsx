"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useCatalog } from "@/components/providers/catalog-provider";
import { CategoryFilters } from "@/components/category-filters";

export function HomeCategories() {
  const { products, ready } = useCatalog();
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  if (!ready) return null;

  return (
    <section className="border-y border-neutral-200 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Browse
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
              Shop by category
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-black transition-opacity hover:opacity-70"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6">
          <CategoryFilters categories={categories} />
        </div>
      </div>
    </section>
  );
}
