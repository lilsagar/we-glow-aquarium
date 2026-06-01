"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowUpRight, Mail, Share2 } from "lucide-react";
import { useCatalog } from "@/components/providers/catalog-provider";

export function Footer() {
  const { products } = useCatalog();
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );
  return (
    <footer className="mt-auto border-t border-neutral-800 bg-black text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-bold uppercase tracking-[0.25em] text-white">
              We-Glow
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
              Premium aquarium gear for modern homes. Curated tanks, filtration, and
              essentials — priced clearly in Nepali Rupees.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="mailto:hello@weglow.demo"
                className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-700 text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-black"
                aria-label="Email us"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="#"
                className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-700 text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-black"
                aria-label="Instagram"
              >
                <Share2 className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white">
              Shop
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 transition-colors hover:text-white"
                >
                  All products
                  <ArrowUpRight className="size-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="transition-colors hover:text-white">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white">
              Categories
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {categories.slice(0, 6).map((c) => (
                <li key={c}>
                  <Link
                    href={`/products?category=${encodeURIComponent(c)}`}
                    className="transition-colors hover:text-white"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white">
              Support
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="text-neutral-500">Delivery across Nepal (demo)</span>
              </li>
              <li>
                <span className="text-neutral-500">Cash on delivery</span>
              </li>
              <li>
                <span className="text-neutral-500">7-day returns policy (placeholder)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} We-Glow Aquarium. All rights reserved.</p>
          <p className="uppercase tracking-wider">Designed for clarity · Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
