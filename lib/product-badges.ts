import type { Product } from "@/lib/types/product";

export type ProductBadge = {
  label: string;
  tone: "bestseller" | "rated" | "new" | "soldout";
};

export function getProductBadges(product: Product): ProductBadge[] {
  const badges: ProductBadge[] = [];

  if (!product.inStock) {
    badges.push({ label: "Sold Out", tone: "soldout" });
    return badges;
  }

  if (product.reviewCount >= 200 && product.rating >= 4.4) {
    badges.push({ label: "Best Seller", tone: "bestseller" });
  } else if (product.rating >= 4.7) {
    badges.push({ label: "Top Rated", tone: "rated" });
  }

  if (product.reviewCount < 100 && product.rating >= 4.5) {
    badges.push({ label: "New Arrival", tone: "new" });
  }

  return badges.slice(0, 2);
}
