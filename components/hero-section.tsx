import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE = "/placeholder.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Premium aquarium display with lush plants and dramatic lighting"
          fill
          priority
          className="object-cover object-center brightness-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_35%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-36">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200 shadow-sm shadow-cyan-500/10">
            Premium aquarium essentials
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              Luxury aquariums for modern Nepalese homes.
            </h1>
            <p className="max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
              Discover curated tanks, filtration systems, and design-forward accessories with clear NPR pricing and fast local delivery.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore the collection
              <ArrowRight className="ml-3 size-5" />
            </Link>
            <Link
              href="/products?category=Tanks"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white transition hover:border-white"
            >
              Shop tanks
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">Curated selection</p>
              <p className="mt-2 text-slate-400">Premium aquariums, filters, and supplies chosen for quality.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">Transparent pricing</p>
              <p className="mt-2 text-slate-400">All prices shown clearly in Nepali Rupees for fast checkout.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">Reliable delivery</p>
              <p className="mt-2 text-slate-400">Local shipping and support across Nepal, with every order.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
