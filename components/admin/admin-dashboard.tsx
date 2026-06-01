"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatNpr } from "@/lib/format-npr";
import { subscribeToOrders, getOrderStatusLabel } from "@/lib/orders";
import type { Order } from "@/lib/types/order";
import { useCatalog } from "@/components/providers/catalog-provider";
import { StatCard } from "./stat-card";

export function AdminDashboard() {
  const { products, ready: catalogReady } = useCatalog();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersReady, setOrdersReady] = useState(false);

  useEffect(() => {
    const unsub = subscribeToOrders(
      (list) => {
        setOrders(list);
        setOrdersReady(true);
      },
      () => setOrdersReady(true),
    );
    return unsub;
  }, []);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.subtotalNpr, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const lowStock = products.filter((p) => !p.inStock).length;
    return { revenue, pending, lowStock };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 5);

  if (!catalogReady || !ordersReady) {
    return <p className="text-sm text-neutral-500">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total products" value={products.length} hint="Firestore catalog" />
        <StatCard label="Total orders" value={orders.length} hint="Firestore orders" />
        <StatCard
          label="Revenue"
          value={formatNpr(stats.revenue)}
          hint="Excludes cancelled"
        />
        <StatCard label="Pending orders" value={stats.pending} hint={`${stats.lowStock} out of stock`} />
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-bold text-black">Recent orders</h2>
            <p className="text-sm text-neutral-500">Live from Firestore</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-black underline-offset-4 hover:underline"
          >
            View all orders
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-neutral-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-black">{order.id}</td>
                    <td className="px-6 py-4 text-neutral-600">{order.customer.fullName}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800">
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-black">
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
