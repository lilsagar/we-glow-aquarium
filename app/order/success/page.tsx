import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderSuccessClient } from "./order-success-client";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your We-Glow Aquarium order was placed successfully.",
};

export default function OrderSuccessPage() {
  return (
    <main className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4">
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="text-black">Order confirmed</span>
        </nav>

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-neutral-600">Loading your order…</p>
              </div>
            }
          >
            <OrderSuccessClient />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
