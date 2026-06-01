import type { Product } from "@/lib/types/product";

export type ProductFilters = {
  category?: string;
  q?: string;
};

export function filterProducts(
  items: Product[],
  { category, q }: ProductFilters,
): Product[] {
  let list = items;

  if (category?.trim()) {
    list = list.filter((p) => p.category === category.trim());
  }

  const query = q?.trim().toLowerCase();
  if (query) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    );
  }

  return list;
}

export function getCategories(items: Product[]): string[] {
  return Array.from(new Set(items.map((p) => p.category))).sort();
}
