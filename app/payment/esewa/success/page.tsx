import type { Metadata } from "next";
import Link from "next/link";
import { formatNpr } from "@/lib/format-npr";
import { getPaymentLabel } from "@/lib/orders";
import { verifyEsewaPayment } from "@/lib/esewa";

export const metadata: Metadata = {
  title: "eSewa Payment Success",
  description: "Your eSewa payment was successful.",
};

type Props = {
  searchParams: {
    orderId?: string;
    pid?: string;
    amt?: string;
    total_amount?: string;
    amount?: string;
  };
};

export default async function EsewaSuccessPage({ searchParams }: Props) {
  const orderId = searchParams?.orderId ?? searchParams?.pid;
  const amount =
    searchParams?.amt ?? searchParams?.total_amount ?? searchParams?.amount;


  if (!orderId) {
    return (
      <main className="py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-black">Payment completed</h1>
          <p className="mt-4 text-sm text-neutral-600">We could not resolve the order. Please return to the store.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const verification = await verifyEsewaPayment(orderId, amount);
  const order = verification.order;
  if (!order) {
    return (
      <main className="py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-black">Order not found</h1>
          <p className="mt-4 text-sm text-neutral-600">The order ID returned from eSewa does not exist in our system.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const displayedOrder = order;
  const verificationMessage = verification.message;
  const isPaid = verification.updated || displayedOrder.status === "paid";
  const heading = isPaid ? "Payment successful" : "Payment verification pending";
  const description = isPaid
    ? "Your payment has been confirmed and the order status has been updated."
    : "We could not verify the payment automatically. Please contact support if your order does not appear as paid.";

  return (
    <main className="py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">eSewa sandbox</p>
          <h1 className="mt-4 text-3xl font-bold text-black">{heading}</h1>
          <p className="mt-2 text-sm text-neutral-600">{description}</p>
          <p className="mt-4 text-sm text-neutral-500">{verificationMessage}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-neutral-500">
            {formatNpr(displayedOrder.subtotalNpr)} {"NPR"}
          </p>
          <p className="mt-2 text-sm text-neutral-500">Order ID: {displayedOrder.id}</p>
          <p className="mt-2 text-sm text-neutral-500">Status: {isPaid ? "Paid" : displayedOrder.status}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.27em] text-neutral-500">Payment</h2>
            <p className="mt-4 text-lg font-semibold text-black">{getPaymentLabel(displayedOrder.paymentMethod)}</p>
            <p className="mt-2 text-sm text-neutral-500">Status: Paid</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.27em] text-neutral-500">Delivery</h2>
            <p className="mt-4 text-sm text-black">{displayedOrder.customer.fullName}</p>
            <p className="text-sm text-neutral-500">{displayedOrder.customer.phone}</p>
            <p className="mt-2 text-sm text-neutral-500">{displayedOrder.customer.address}, {displayedOrder.customer.city}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-black hover:border-black"
          >
            View order in admin
          </Link>
        </div>
      </div>
    </main>
  );
}

