"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Search } from "lucide-react";

type Props = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  compact?: boolean;
  id?: string;
  variant?: "dark" | "light";
};

export function SearchBar({
  defaultValue = "",
  value,
  onValueChange,
  onSubmit,
  compact = false,
  id = "site-search",
  variant = "dark",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentQuery = isControlled ? value : query;

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = currentQuery.trim();
    if (onSubmit) {
      onSubmit(trimmed);
      return;
    }

    if (trimmed) {
      router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const nextValue = e.target.value;
    if (!isControlled) {
      setQuery(nextValue);
    }
    onValueChange?.(nextValue);
  }

  const isDark = variant === "dark";

  return (
    <form onSubmit={submit} className="w-full">
      <label className="sr-only" htmlFor={id}>
        Search products
      </label>
      <div
        className={`flex overflow-hidden rounded-full border transition-shadow duration-300 focus-within:ring-2 ${
          compact ? "h-10" : "h-11"
        } ${
          isDark
            ? "border-neutral-700 bg-neutral-900 focus-within:border-white focus-within:ring-white/20"
            : "border-neutral-300 bg-white focus-within:border-black focus-within:ring-black/10"
        }`}
      >
        <input
          id={id}
          type="search"
          value={currentQuery}
          onChange={handleChange}
          placeholder="Search tanks, filters, food…"
          className={`min-w-0 flex-1 border-0 bg-transparent px-4 focus:outline-none ${
            compact ? "text-sm" : "text-sm sm:text-base"
          } ${
            isDark
              ? "text-white placeholder:text-neutral-500"
              : "text-black placeholder:text-neutral-400"
          }`}
        />
        <button
          type="submit"
          aria-label="Search"
          className={`inline-flex shrink-0 items-center justify-center px-4 transition-colors duration-200 ${
            isDark
              ? "bg-white text-neutral-900 hover:bg-neutral-200"
              : "bg-black text-white hover:bg-neutral-800"
          }`}
        >
          <Search className="size-4 sm:size-5" aria-hidden />
        </button>
      </div>
    </form>
  );
}
