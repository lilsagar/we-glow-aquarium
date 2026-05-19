import Link from "next/link";

type Props = {
  categories: string[];
  activeCategory?: string;
  searchQuery?: string;
};

function buildHref(category: string | null, searchQuery?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (searchQuery?.trim()) params.set("q", searchQuery.trim());
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function CategoryFilters({
  categories,
  activeCategory,
  searchQuery,
}: Props) {
  const pills = [{ label: "All", value: null as string | null }, ...categories.map((c) => ({ label: c, value: c }))];

  return (
    <div
      id="categories"
      className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {pills.map(({ label, value }) => {
        const active = value ? activeCategory === value : !activeCategory;
        return (
          <Link
            key={label}
            href={buildHref(value, searchQuery)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              active
                ? "border-black bg-black text-white shadow-md"
                : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:shadow-sm"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
