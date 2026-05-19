"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { formatNpr } from "@/lib/format-npr";
import { deleteProduct } from "@/lib/catalog";
import { useCatalog } from "@/components/providers/catalog-provider";

export function AdminProducts() {
  const { products, ready, refresh } = useCatalog();
  const [deleting, setDeleting] = useState<string | null>(null);

  function handleDelete(slug: string, name: string) {
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    setDeleting(slug);
    deleteProduct(slug);
    refresh();
    setDeleting(null);
  }

  if (!ready) {
    return <p className="text-sm text-neutral-500">Loading products…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">{products.length} products in catalog</p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800"
        >
          <Plus className="size-4" />
          Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => (
                <tr key={p.slug} className="hover:bg-neutral-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-black line-clamp-1">{p.name}</p>
                        <p className="text-xs text-neutral-500">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-600">{p.category}</td>
                  <td className="px-5 py-4 font-medium text-black">{formatNpr(p.priceNpr)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.inStock
                          ? "bg-neutral-100 text-neutral-800"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {p.inStock ? "In stock" : "Out"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${encodeURIComponent(p.slug)}/edit`}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-black hover:border-black"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        disabled={deleting === p.slug}
                        onClick={() => handleDelete(p.slug, p.name)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-500">No products yet.</p>
        ) : null}
      </div>
    </div>
  );
}
