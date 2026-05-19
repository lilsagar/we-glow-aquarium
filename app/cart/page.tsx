import Link from "next/link";
import type { Metadata } from "next";
import { CartClient } from "./cart-client";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your items before checkout.",
};

export default function CartPage() {
  return (
    <main className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="text-black">Cart</span>
        </nav>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Your cart
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Update quantities, remove items, then proceed to checkout.
        </p>

        <div className="mt-8">
          <CartClient />
        </div>
      </div>
    </main>
  );
}
