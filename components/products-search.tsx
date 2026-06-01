"use client";

import { SearchBar } from "@/components/search-bar";

export function ProductsSearch({
  query,
  onQueryChange,
  onSubmit,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  return (
    <div className="max-w-xl">
      <SearchBar
        id="products-search"
        value={query}
        onValueChange={onQueryChange}
        onSubmit={onSubmit}
        variant="light"
      />
    </div>
  );
}
