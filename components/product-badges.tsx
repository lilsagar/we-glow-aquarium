import { getProductBadges } from "@/lib/product-badges";
import type { Product } from "@/lib/types/product";

const toneStyles = {
  bestseller: "bg-black text-white border-black/20",
  rated: "bg-white/90 text-black border-white/40",
  new: "bg-white/90 text-black border-white/40",
  soldout: "bg-neutral-800/90 text-white border-white/10",
};

export function ProductBadges({ product }: { product: Product }) {
  const badges = getProductBadges(product);
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md sm:px-3 sm:text-[11px] ${toneStyles[badge.tone]}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
