"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types/product";
import { getSafeImageUrl } from "@/lib/image-url";
import {
  createProduct,
  getCategoriesFromProducts,
  updateProduct,
} from "@/lib/catalog";
import { uploadImageFile } from "@/lib/firebase/storage";
import { useCatalog } from "@/components/providers/catalog-provider";

export type ProductFormValues = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  priceNpr: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: string;
  reviewCount: string;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-black shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10";

function emptyForm(): ProductFormValues {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    priceNpr: "",
    category: "",
    imageUrl: "",
    inStock: true,
    rating: "4.5",
    reviewCount: "0",
  };
}

function fromProduct(p: Product): ProductFormValues {
  return {
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    priceNpr: String(p.priceNpr),
    category: p.category,
    imageUrl: p.imageUrl,
    inStock: p.inStock,
    rating: String(p.rating),
    reviewCount: String(p.reviewCount),
  };
}

export function ProductForm({
  mode,
  product,
}: {
  mode: "create" | "edit";
  product?: Product;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { products, refresh } = useCatalog();
  const [form, setForm] = useState<ProductFormValues>(
    product ? fromProduct(product) : emptyForm(),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

  function validateFile(file: File) {
    if (file.size > MAX_UPLOAD_SIZE) {
      setUploadError("File is too large. Maximum size is 10 MB.");
      return false;
    }
    return true;
  }

  const categories = useMemo(
    () => getCategoriesFromProducts(products),
    [products],
  );

  async function handleFileUpload(file: File) {
    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadImageFile(file, (progress) => {
        setUploadProgress(progress);
      });
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not upload image.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Number(form.priceNpr);
    const rating = Number(form.rating);
    const reviewCount = Number(form.reviewCount);

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price in NPR.");
      return;
    }
    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }
    if (!form.imageUrl.trim()) {
      setError("Image URL is required.");
      return;
    }

    setSaving(true);

    try {
      if (mode === "create") {
        await createProduct({
          name: form.name,
          slug: form.slug.trim() || undefined,
          shortDescription: form.shortDescription || form.name,
          description: form.description || form.shortDescription || form.name,
          priceNpr: price,
          category: form.category,
          imageUrl: form.imageUrl,
          inStock: form.inStock,
          rating: Number.isFinite(rating) ? rating : 4.5,
          reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
        });
      } else if (product) {
        await updateProduct(product.slug, {
          name: form.name,
          slug: form.slug.trim() || product.slug,
          shortDescription: form.shortDescription,
          description: form.description,
          priceNpr: price,
          category: form.category,
          imageUrl: form.imageUrl,
          inStock: form.inStock,
          rating: Number.isFinite(rating) ? rating : product.rating,
          reviewCount: Number.isFinite(reviewCount) ? reviewCount : product.reviewCount,
        });
      }
      refresh();
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Product name
          </label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            URL slug
          </label>
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="auto-generated-from-name"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Category
          </label>
          <input
            className={inputClass}
            list="admin-categories"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            required
          />
          <datalist id="admin-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Price (NPR)
          </label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.priceNpr}
            onChange={(e) => setForm((f) => ({ ...f, priceNpr: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Rating (1–5)
          </label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            className={inputClass}
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Image URL
            </label>
            <input
              type="url"
              className={inputClass}
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="/placeholder.png"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Upload image
            </label>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:border-black disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Choose file"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!validateFile(file)) return;
                await handleFileUpload(file);
              }}
              className="sr-only"
            />

            <div
              className={`mt-4 rounded-3xl border px-4 py-8 text-center transition-all duration-200 ${
                dragActive
                  ? "border-cyan-400 bg-cyan-50/50"
                  : "border-dashed border-neutral-300 bg-neutral-50"
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  if (!validateFile(file)) return;
                  await handleFileUpload(file);
                }
              }}
            >
              <p className="text-sm font-semibold text-slate-900">
                Drag & drop an image here
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Or click “Choose file” to select a product photo.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                JPG, PNG, WEBP up to 10MB.
              </p>
            </div>

            {uploading ? (
              <p className="mt-2 text-sm text-neutral-500">
                Uploading image {uploadProgress ?? 0}%…
              </p>
            ) : null}
            {uploadError ? (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            ) : null}
            {form.imageUrl ? (
              <div className="relative mt-4 h-52 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                <Image
                  src={getSafeImageUrl(form.imageUrl)}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Short description
          </label>
          <input
            className={inputClass}
            value={form.shortDescription}
            onChange={(e) =>
              setForm((f) => ({ ...f, shortDescription: e.target.value }))
            }
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Full description
          </label>
          <textarea
            className={`${inputClass} min-h-[140px]`}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
              className="size-4 accent-black"
            />
            <span className="text-sm font-medium text-black">In stock</span>
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-black px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Add product" : "Save changes"}
        </button>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black hover:border-black"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
