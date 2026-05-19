"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCatalog } from "@/components/providers/catalog-provider";
import { filterProducts } from "@/lib/filter-products";
import { ProductGrid } from "@/components/product-grid";
import { CategoryFilters } from "@/components/category-filters";
import { ProductsSearch } from "@/components/products-search";

type Props = {
  category?: string;
  q?: string;
};

export function ProductsCatalog({ category, q }: Props) {
  const { products, ready } = useCatalog();

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const list = useMemo(
    () => filterProducts(products, { category, q }),
    [products, category, q],
  );

  if (!ready) {
    return <p className="text-sm text-neutral-500">Loading products…</p>;
  }

  return (
    <>
      <div className="mt-8 space-y-6">
        <ProductsSearch defaultQuery={q} />
        <CategoryFilters categories={categories} activeCategory={category} searchQuery={q} />
      </div>

      {list.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-black">No products found</p>
          <p className="mt-2 text-sm text-neutral-600">
            Try a different search term or category.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Browse all
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <ProductGrid products={list} />
        </div>
      )}
    </>
  );
}
