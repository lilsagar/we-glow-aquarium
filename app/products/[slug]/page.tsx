import Link from "next/link";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/store/product-detail";
import { seedProducts } from "@/data/products";

export const dynamic = "force-dynamic";

const siteUrl = "https://we-glow-aquarium.example.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = seedProducts.find((item) => item.slug === slug);

  if (!product) {
    return {
      title: slug.replace(/-/g, " "),
      description: "Aquarium product at We Glow Aquarium",
    };
  }

  const productUrl = `${siteUrl}/products/${product.slug}`;
  const description = product.shortDescription;

  return {
    title: `${product.name} · We Glow Aquarium`,
    description,
    keywords: [
      "Nepal aquarium supplies",
      "aquarium product",
      "fish tank",
      product.category,
      "NPR aquarium store",
    ],
    openGraph: {
      title: product.name,
      description,
      url: productUrl,
      images: [product.imageUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = seedProducts.find((item) => item.slug === slug);
  const productUrl = `${siteUrl}/products/${slug}`;

  const jsonLd = product
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: [product.imageUrl],
        sku: product.slug,
        brand: {
          "@type": "Brand",
          name: "We Glow Aquarium",
        },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "NPR",
          price: product.priceNpr.toFixed(2),
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating.toFixed(1),
          reviewCount: product.reviewCount,
        },
      })
    : null;

  return (
    <>
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
      {jsonLd ? (
        <script type="application/ld+json">{jsonLd}</script>
      ) : null}
    </>
  );
}
