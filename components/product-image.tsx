import Image from "next/image";
import type { Product } from "@/data/products";

type Props = {
  product: Pick<Product, "name" | "slug" | "imageUrl">;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function ProductImage({
  product,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
}: Props) {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden bg-neutral-100 ${className}`}
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  );
}
