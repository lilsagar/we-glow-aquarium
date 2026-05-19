import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544551763-46aef011bacf?w=2400&h=1400&fit=crop&q=85";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[min(92vh,820px)] w-full items-end overflow-hidden bg-black text-white sm:min-h-[min(88vh,900px)] sm:items-center"
      aria-label="We-Glow Aquarium hero"
    >
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Large planted aquarium with crystal clear water"
          fill
          priority
          className="scale-105 object-cover object-center animate-hero-zoom"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(0,0,0,0.85),transparent)]"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="max-w-3xl animate-fade-in-up">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-neutral-400 sm:text-xs">
            We-Glow Aquarium · Nepal
          </p>

          <h1 className="mt-4 text-[2.5rem] font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[4.5rem]">
            Where your
            <br />
            <span className="text-white">aquarium</span>
            <br />
            <span className="text-neutral-400">comes alive.</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-300 sm:mt-6 sm:text-base md:text-lg">
            Premium tanks, filtration, and essentials — curated for modern homes.
            Every price in Nepali Rupees, delivered with clarity.
          </p>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/products"
              className="animate-cta group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_0_1px_rgba(255,255,255,0.1)] sm:px-10 sm:py-4.5 sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Shop now
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 sm:size-5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-100 to-transparent sm:h-32"
        aria-hidden
      />
    </section>
  );
}
