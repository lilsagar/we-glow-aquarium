import Link from "next/link";
import type { Metadata } from "next";
import { seedProducts } from "@/data/products";
import { ProductDetail } from "@/components/store/product-detail";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = seedProducts.find((p) => p.slug === slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="transition-colors hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <Link href="/products" className="transition-colors hover:text-black">
            Products
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="text-black">Product</span>
        </nav>
        <ProductDetail slug={slug} />
      </div>
    </main>
  );
}
