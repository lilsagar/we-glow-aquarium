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
import {
  getCatalogProducts,
  initializeCatalog,
  type Product,
} from "@/lib/catalog";

type CatalogContextValue = {
  products: Product[];
  ready: boolean;
  refresh: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    initializeCatalog();
    setProducts(getCatalogProducts());
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      refresh();
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, [refresh]);

  const value = useMemo(
    () => ({ products, ready, refresh }),
    [products, ready, refresh],
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
