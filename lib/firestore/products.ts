import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { seedProducts } from "@/data/products";
import { getFirestoreDb } from "@/lib/firebase/client";
import type { Product } from "@/lib/types/product";

const COLLECTION = "products";

function productsRef() {
  return collection(getFirestoreDb(), COLLECTION);
}

function productDoc(slug: string) {
  return doc(getFirestoreDb(), COLLECTION, slug);
}

function fromFirestore(id: string, data: Record<string, unknown>): Product {
  return {
    slug: id,
    name: String(data.name ?? ""),
    shortDescription: String(data.shortDescription ?? ""),
    description: String(data.description ?? ""),
    priceNpr: Number(data.priceNpr ?? 0),
    rating: Number(data.rating ?? 4.5),
    reviewCount: Number(data.reviewCount ?? 0),
    category: String(data.category ?? ""),
    inStock: Boolean(data.inStock ?? true),
    imageUrl: String(data.imageUrl ?? ""),
  };
}

function toFirestore(product: Product): Omit<Product, "slug"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit slug for doc body
  const { slug, ...rest } = product;
  return rest;
}

export async function fetchProducts(): Promise<Product[]> {
  const snap = await getDocs(productsRef());
  return snap.docs.map((d) => fromFirestore(d.id, d.data()));
}

export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(productsRef());
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => fromFirestore(d.id, d.data()));
      list.sort((a, b) => a.name.localeCompare(b.name));
      onData(list);
    },
    (err) => onError?.(err),
  );
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const snap = await getDoc(productDoc(slug));
  if (!snap.exists()) return null;
  return fromFirestore(snap.id, snap.data());
}

export async function seedProductsIfEmpty(): Promise<number> {
  const existing = await fetchProducts();
  if (existing.length > 0) return 0;

  const batch = writeBatch(getFirestoreDb());
  for (const p of seedProducts) {
    batch.set(productDoc(p.slug), toFirestore(p));
  }
  await batch.commit();
  return seedProducts.length;
}

export async function createUniqueSlug(
  name: string,
  excludeSlug?: string,
): Promise<string> {
  const products = await fetchProducts();
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "product";

  let candidate = base;
  let n = 1;
  while (products.some((p) => p.slug === candidate && p.slug !== excludeSlug)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function createProduct(
  input: Omit<Product, "slug" | "rating" | "reviewCount"> & {
    slug?: string;
    rating?: number;
    reviewCount?: number;
  },
): Promise<Product> {
  const slug = input.slug?.trim()
    ? await createUniqueSlug(input.slug.trim())
    : await createUniqueSlug(input.name);

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

  await setDoc(productDoc(slug), toFirestore(product));
  return product;
}

export async function updateProduct(
  slug: string,
  patch: Partial<Product>,
): Promise<Product | null> {
  const current = await fetchProductBySlug(slug);
  if (!current) return null;

  const nextSlug =
    patch.slug && patch.slug !== slug
      ? await createUniqueSlug(patch.slug, slug)
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

  if (nextSlug !== slug) {
    await setDoc(productDoc(nextSlug), toFirestore(updated));
    await deleteDoc(productDoc(slug));
  } else {
    await updateDoc(productDoc(slug), toFirestore(updated) as Record<string, unknown>);
  }

  return updated;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  const snap = await getDoc(productDoc(slug));
  if (!snap.exists()) return false;
  await deleteDoc(productDoc(slug));
  return true;
}

export function getCategoriesFromProducts(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category))).sort();
}
