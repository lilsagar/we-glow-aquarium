"use client";

import { SearchBar } from "@/components/search-bar";

export function ProductsSearch({ defaultQuery }: { defaultQuery?: string }) {
  return (
    <div className="max-w-xl">
      <SearchBar
        key={defaultQuery ?? "all"}
        id="products-search"
        defaultValue={defaultQuery ?? ""}
        variant="light"
      />
    </div>
  );
}
