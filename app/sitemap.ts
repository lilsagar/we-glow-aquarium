import type { MetadataRoute } from "next";
import { seedProducts } from "@/data/products";

const siteUrl = "https://we-glow-aquarium.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const productUrls = seedProducts.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/products` },
    { url: `${siteUrl}/cart` },
    { url: `${siteUrl}/checkout` },
    ...productUrls,
  ];
}
