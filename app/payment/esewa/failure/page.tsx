import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "eSewa Payment Failed",
  description: "Your eSewa payment was not completed.",
};

type Props = {
  searchParams?: {
    orderId?: string;
    pid?: string;
  };
};

export default function EsewaFailurePage({ searchParams }: Props) {
  const orderId = searchParams?.orderId ?? searchParams?.pid;

  return (
    <main className="py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-red-500">eSewa sandbox</p>
        <h1 className="mt-4 text-3xl font-bold text-black">Payment failed</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Your payment could not be completed. Please try again or choose another payment method.
        </p>
        {orderId ? (
          <p className="mt-4 text-sm text-neutral-500">Order ID: {orderId}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
          >
            Return to checkout
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-black hover:border-black"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
