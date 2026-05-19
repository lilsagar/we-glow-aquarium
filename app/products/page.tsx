import Link from "next/link";
import { ProductsCatalog } from "@/components/store/products-catalog";

type Props = {
  searchParams?: Promise<{ category?: string; q?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const category = sp.category?.trim();
  const q = sp.q?.trim();

  return (
    <main className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="text-black">Products</span>
        </nav>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Catalog
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {q ? `Results for “${q}”` : category ? category : "All products"}
            </h1>
          </div>
          {(category || q) ? (
            <Link
              href="/products"
              className="text-sm font-semibold text-black underline-offset-4 hover:underline"
            >
              Clear filters
            </Link>
          ) : null}
        </div>

        <ProductsCatalog category={category} q={q} />
      </div>
    </main>
  );
}
