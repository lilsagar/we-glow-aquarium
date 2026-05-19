import Link from "next/link";
import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter delivery details and place your demo order.",
};

export default function CheckoutPage() {
  return (
    <main className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="text-black">Checkout</span>
        </nav>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your delivery details to simulate an order. Nothing is sent to a server yet.
        </p>

        <div className="mt-8">
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
