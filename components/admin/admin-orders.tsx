"use client";

import { useEffect, useState } from "react";
import { formatNpr } from "@/lib/format-npr";
import {
  subscribeToOrders,
  getPaymentLabel,
  ORDER_STATUSES,
  updateOrderStatusInFirestore,
  getOrderStatusLabel,
} from "@/lib/orders";
import type { Order, OrderStatus } from "@/lib/types/order";

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToOrders(
      (list) => {
        setOrders(list);
        setReady(true);
      },
      () => setReady(true),
    );
    return unsub;
  }, []);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdating(orderId);
    try {
      await updateOrderStatusInFirestore(orderId, status);
    } finally {
      setUpdating(null);
    }
  }

  if (!ready) {
    return <p className="text-sm text-neutral-500">Loading orders…</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600">{orders.length} orders in Firestore</p>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-neutral-500">
            No orders yet. Place a test order from the storefront checkout.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">City</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top hover:bg-neutral-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-black">{order.id}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleString("en-NP", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-black">{order.customer.fullName}</p>
                      <p className="text-neutral-600">{order.customer.phone}</p>
                      <p className="mt-1 max-w-[200px] line-clamp-2 text-xs text-neutral-500">
                        {order.customer.address}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-neutral-600">{order.customer.city}</td>
                    <td className="px-5 py-4 text-neutral-600">
                      {getPaymentLabel(order.paymentMethod)}
                    </td>
                    <td className="px-5 py-4">
                      <label className="sr-only" htmlFor={`status-${order.id}`}>
                        Order status
                      </label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-neutral-400">
                        {getOrderStatusLabel(order.status)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-black">
                      {formatNpr(order.subtotalNpr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
