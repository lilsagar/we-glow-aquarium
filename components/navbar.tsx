"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { SearchBar } from "@/components/search-bar";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=Tanks", label: "Tanks" },
  { href: "/products?category=Filtration", label: "Filtration" },
  { href: "/cart", label: "Cart" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-3 sm:gap-6">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-700 text-white transition-colors hover:bg-neutral-900 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link
            href="/"
            className="shrink-0 text-lg font-bold uppercase tracking-[0.2em] text-white sm:text-xl"
          >
            We-Glow
          </Link>

          <div className="hidden min-w-0 flex-1 lg:block">
            <SearchBar id="desktop-search" />
          </div>

          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium lg:flex">
            {navLinks.slice(0, 3).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-neutral-300 transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            className="relative inline-flex size-10 items-center justify-center rounded-full border border-neutral-700 transition-colors duration-200 hover:bg-neutral-900 sm:size-auto sm:gap-2 sm:px-4 sm:py-2"
          >
            <ShoppingBag className="size-5" aria-hidden />
            <span className="hidden text-sm font-medium sm:inline">Cart</span>
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>
        </div>

        <div className="pb-3 lg:hidden">
          <SearchBar id="mobile-search" compact />
        </div>
      </div>

      <div className="hidden border-t border-neutral-800 bg-neutral-950 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
          <span className="text-white">Nepal delivery</span>
          <span>·</span>
          <span>Prices in NPR</span>
          <span>·</span>
          <span>Premium aquarium essentials</span>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="animate-fade-in border-t border-neutral-800 bg-black px-4 py-6 lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/checkout"
                className="block rounded-lg px-3 py-3 text-base font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
              >
                Checkout
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
