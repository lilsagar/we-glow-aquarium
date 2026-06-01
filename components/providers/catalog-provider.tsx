"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import {
  seedProductsIfEmpty,
  subscribeToProducts,
  type Product,
} from "@/lib/catalog";

type CatalogContextValue = {
  products: Product[];
  ready: boolean;
  error: string | null;
  refresh: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

const firebaseReady = isFirebaseConfigured();

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(!firebaseReady);
  const [error, setError] = useState<string | null>(
    firebaseReady ? null : "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.",
  );
  const [seeded, setSeeded] = useState(false);

  const refresh = useCallback(() => {
    setReady(false);
    setSeeded((s) => !s);
  }, []);

  useEffect(() => {
    if (!firebaseReady) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function start() {
      try {
        if (!seeded) {
          await seedProductsIfEmpty();
          if (!cancelled) setSeeded(true);
        }
        unsubscribe = subscribeToProducts(
          (list) => {
            if (!cancelled) {
              setProducts(list);
              setReady(true);
              setError(null);
            }
          },
          (err) => {
            if (!cancelled) {
              setError(err.message);
              setReady(true);
            }
          },
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load products");
          setReady(true);
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [seeded]);

  const value = useMemo(
    () => ({ products, ready, error, refresh }),
    [products, ready, error, refresh],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return ctx;
}

export function useProductBySlug(slug: string): Product | undefined {
  const { products } = useCatalog();
  return products.find((p) => p.slug === slug);
}
