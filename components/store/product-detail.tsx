"use client";

import { notFound } from "next/navigation";
import { formatNpr } from "@/lib/format-npr";
import { useCatalog, useProductBySlug } from "@/components/providers/catalog-provider";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductImage } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";

export function ProductDetail({ slug }: { slug: string }) {
  const { ready, error } = useCatalog();
  const product = useProductBySlug(slug);

  if (ready && !product && !error) notFound();

  if (error) {
    return (
      <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
    );
  }

  if (!product) {
    return <p className="mt-8 text-sm text-neutral-500">Loading product…</p>;
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="animate-scale-in">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <ProductImage
            product={product}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="rounded-2xl"
          />
        </div>
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600 shadow-sm">
          <h2 className="text-base font-semibold text-black">About this item</h2>
          <p className="mt-3 leading-relaxed">{product.description}</p>
        </div>
      </div>

      <div className="animate-fade-in-up stagger-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
          {product.category}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {product.name}
        </h1>
        <div className="mt-4">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <p className="mt-4 text-base text-neutral-600">{product.shortDescription}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          {product.inStock ? (
            <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              In stock
            </span>
          ) : (
            <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Out of stock
            </span>
          )}
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-8">
          <p className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            {formatNpr(product.priceNpr)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Price in Nepali Rupees (NPR)</p>
        </div>

        <div className="mt-8">
          <ProductBuyBox product={product} />
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          <p className="font-semibold text-black">Delivery</p>
          <p className="mt-2">
            Checkout with name, phone, address, and city. Choose COD, eSewa, or Khalti.
          </p>
        </div>
      </div>
    </div>
  );
}
