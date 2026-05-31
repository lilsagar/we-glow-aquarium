import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { HomeCategories } from "@/components/store/home-categories";
import { HomeBestsellers } from "@/components/store/home-bestsellers";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HomeCategories />
      <HomeBestsellers />

      <section className="border-t border-neutral-200 bg-black py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">
            We-Glow promise
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-4xl">
            Clean design. Clear prices. Healthy aquariums.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-400 sm:text-base">
            Every product shows Nepali Rupee pricing upfront. Add to cart, review your
            order, and checkout with delivery details.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/products"
              className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-black hover:bg-neutral-200"
            >
              Start shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
