"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useCatalog } from "@/components/providers/catalog-provider";
import type { Product } from "@/lib/types/product";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalNpr: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeLine: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "we-glow-aquarium-cart-v1";

type StoredLine = { slug: string; quantity: number };

function readStoredLines(): StoredLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (row): row is StoredLine =>
          !!row &&
          typeof row === "object" &&
          "slug" in row &&
          "quantity" in row &&
          typeof (row as StoredLine).slug === "string" &&
          typeof (row as StoredLine).quantity === "number",
      )
      .map((row) => ({
        slug: row.slug,
        quantity: Math.max(1, Math.floor(row.quantity)),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, ready: catalogReady } = useCatalog();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const userTouched = useRef(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!catalogReady || hydrated.current) return;

    const id = window.setTimeout(() => {
      if (!userTouched.current) {
        const stored = readStoredLines();
        const next: CartLine[] = [];
        for (const row of stored) {
          const product = products.find((p) => p.slug === row.slug);
          if (product) next.push({ product, quantity: row.quantity });
        }
        setLines(next);
      }
      hydrated.current = true;
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, [catalogReady, products]);

  useEffect(() => {
    if (!storageReady) return;
    const payload: StoredLine[] = lines.map((l) => ({
      slug: l.product.slug,
      quantity: l.quantity,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [storageReady, lines]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    userTouched.current = true;
    const q = Math.max(1, Math.floor(quantity));
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.product.slug === product.slug);
      if (idx === -1) return [...prev, { product, quantity: q }];
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        quantity: copy[idx].quantity + q,
      };
      return copy;
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    userTouched.current = true;
    const q = Math.floor(quantity);
    setLines((prev) => {
      if (q <= 0) return prev.filter((l) => l.product.slug !== slug);
      return prev.map((l) =>
        l.product.slug === slug ? { ...l, quantity: q } : l,
      );
    });
  }, []);

  const removeLine = useCallback((slug: string) => {
    userTouched.current = true;
    setLines((prev) => prev.filter((l) => l.product.slug !== slug));
  }, []);

  const clearCart = useCallback(() => {
    userTouched.current = true;
    setLines([]);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );

  const subtotalNpr = useMemo(
    () =>
      lines.reduce((sum, l) => sum + l.product.priceNpr * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotalNpr,
      addItem,
      setQuantity,
      removeLine,
      clearCart,
    }),
    [lines, itemCount, subtotalNpr, addItem, setQuantity, removeLine, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
