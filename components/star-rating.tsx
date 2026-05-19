import { Star } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const iconSize = size === "md" ? "size-4" : "size-3.5";

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label={`Rated ${rating} out of 5, ${reviewCount} reviews`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < full || (i === full && hasHalf);
          return (
            <Star
              key={i}
              className={`${iconSize} ${
                filled ? "fill-black text-black" : "fill-neutral-200 text-neutral-200"
              }`}
              aria-hidden
            />
          );
        })}
      </div>
      <span className={`${size === "md" ? "text-sm" : "text-xs"} text-neutral-600`}>
        <span className="font-semibold text-black">{rating.toFixed(1)}</span>
        <span className="text-neutral-400"> ({reviewCount.toLocaleString()})</span>
      </span>
    </div>
  );
}
