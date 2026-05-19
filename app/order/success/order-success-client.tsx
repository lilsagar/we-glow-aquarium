"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatNpr } from "@/lib/format-npr";
import { getOrderById, getPaymentLabel } from "@/lib/orders";

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const order = useMemo(() => {
    if (!orderId) return null;
    return getOrderById(orderId) ?? null;
  }, [orderId]);

  if (!order) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-black">Order not found</p>
        <p className="mt-2 text-sm text-neutral-600">
          This order may have been cleared from your browser storage.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const placedAt = new Date(order.createdAt).toLocaleString("en-NP", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="animate-scale-in space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <CheckCircle2 className="mx-auto size-14 text-black" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-black sm:text-3xl">
          Order placed successfully
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Thank you, <span className="font-semibold text-black">{order.customer.fullName}</span>.
          We have received your order.
        </p>
        <p className="mt-4 inline-block rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-700">
          Order ID · {order.id}
        </p>
        <p className="mt-2 text-xs text-neutral-500">{placedAt}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            Delivery
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Name</dt>
              <dd className="font-medium text-black">{order.customer.fullName}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd className="font-medium text-black">{order.customer.phone}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">City</dt>
              <dd className="font-medium text-black">{order.customer.city}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Address</dt>
              <dd className="font-medium text-black">{order.customer.address}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Payment</dt>
              <dd className="font-medium text-black">
                {getPaymentLabel(order.paymentMethod)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            Items ordered
          </h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={item.slug} className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-black">{item.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">Qty {item.quantity}</p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatNpr(item.priceNpr * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="font-semibold text-black">Total</span>
            <span className="text-lg font-bold text-black">
              {formatNpr(order.subtotalNpr)}
            </span>
          </div>
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
          href="/cart"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-black hover:border-black"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}
