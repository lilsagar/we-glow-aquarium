import { seedProducts, type Product } from "@/data/products";

export type { Product };

const CATALOG_STORAGE_KEY = "we-glow-aquarium-catalog-v1";

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const p = value as Product;
  return (
    typeof p.slug === "string" &&
    typeof p.name === "string" &&
    typeof p.shortDescription === "string" &&
    typeof p.description === "string" &&
    typeof p.priceNpr === "number" &&
    typeof p.rating === "number" &&
    typeof p.reviewCount === "number" &&
    typeof p.category === "string" &&
    typeof p.inStock === "boolean" &&
    typeof p.imageUrl === "string"
  );
}

function readRaw(): Product[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(isProduct);
  } catch {
    return null;
  }
}

function writeCatalog(products: Product[]): void {
  window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
}

export function initializeCatalog(): Product[] {
  const existing = readRaw();
  if (existing && existing.length > 0) return existing;
  writeCatalog(seedProducts);
  return [...seedProducts];
}

export function getCatalogProducts(): Product[] {
  if (typeof window === "undefined") return [...seedProducts];
  const stored = readRaw();
  if (!stored || stored.length === 0) return initializeCatalog();
  return stored;
}

export function saveCatalogProducts(products: Product[]): void {
  writeCatalog(products);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getCatalogProducts().find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return getCatalogProducts().map((p) => p.slug);
}

export function getCategories(): string[] {
  return Array.from(new Set(getCatalogProducts().map((p) => p.category))).sort();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function createUniqueSlug(name: string, excludeSlug?: string): string {
  const base = slugify(name) || "product";
  const products = getCatalogProducts();
  let candidate = base;
  let n = 1;
  while (products.some((p) => p.slug === candidate && p.slug !== excludeSlug)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export function createProduct(
  input: Omit<Product, "slug" | "rating" | "reviewCount"> & {
    slug?: string;
    rating?: number;
    reviewCount?: number;
  },
): Product {
  const products = getCatalogProducts();
  const slug = input.slug?.trim()
    ? createUniqueSlug(input.slug, undefined)
    : createUniqueSlug(input.name);

  const product: Product = {
    slug,
    name: input.name.trim(),
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    priceNpr: Math.max(0, Math.floor(input.priceNpr)),
    rating: input.rating ?? 4.5,
    reviewCount: input.reviewCount ?? 0,
    category: input.category.trim(),
    inStock: input.inStock,
    imageUrl: input.imageUrl.trim(),
  };

  saveCatalogProducts([product, ...products]);
  return product;
}

export function updateProduct(slug: string, patch: Partial<Product>): Product | null {
  const products = getCatalogProducts();
  const idx = products.findIndex((p) => p.slug === slug);
  if (idx === -1) return null;

  const current = products[idx];
  const nextSlug =
    patch.slug && patch.slug !== slug
      ? createUniqueSlug(patch.slug, slug)
      : current.slug;

  const updated: Product = {
    ...current,
    ...patch,
    slug: nextSlug,
    name: patch.name?.trim() ?? current.name,
    shortDescription: patch.shortDescription?.trim() ?? current.shortDescription,
    description: patch.description?.trim() ?? current.description,
    category: patch.category?.trim() ?? current.category,
    imageUrl: patch.imageUrl?.trim() ?? current.imageUrl,
    priceNpr:
      patch.priceNpr !== undefined
        ? Math.max(0, Math.floor(patch.priceNpr))
        : current.priceNpr,
  };

  const next = [...products];
  next[idx] = updated;
  saveCatalogProducts(next);
  return updated;
}

export function deleteProduct(slug: string): boolean {
  const products = getCatalogProducts();
  const next = products.filter((p) => p.slug !== slug);
  if (next.length === products.length) return false;
  saveCatalogProducts(next);
  return true;
}

export function resetCatalogToSeed(): void {
  writeCatalog([...seedProducts]);
}
