"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { useCatalog, useProductBySlug } from "@/components/providers/catalog-provider";

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const decoded = decodeURIComponent(slug);
  const { ready } = useCatalog();
  const product = useProductBySlug(decoded);

  if (ready && !product) notFound();

  return (
    <AdminShell title="Edit product" description={product?.name ?? decoded}>
      {product ? (
        <ProductForm mode="edit" product={product} />
      ) : (
        <p className="text-sm text-neutral-500">Loading product…</p>
      )}
    </AdminShell>
  );
}
