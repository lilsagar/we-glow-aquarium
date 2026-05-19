export type Product = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  priceNpr: number;
  /** 1–5 for display only */
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
  imageUrl: string;
};

export const seedProducts: Product[] = [
  {
    slug: "glass-aquarium-12-inch",
    name: 'Glass Aquarium Tank 12"',
    shortDescription: "Starter tank with polished edges — ideal for bettas and shrimp.",
    description:
      "Crystal-clear glass tank with safe silicone seams. Perfect for desktops and first-time keepers. Pair with a small filter and heater for tropical setups.",
    priceNpr: 1850,
    rating: 4.6,
    reviewCount: 128,
    category: "Tanks",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1522069169874-bff5831d51b5?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "glass-aquarium-24-inch",
    name: 'Glass Aquarium Tank 24"',
    shortDescription: "Roomy community tank for small schooling fish.",
    description:
      "Sturdy rimmed construction with high-clarity glass. Suitable for planted aquascapes and community fish. We recommend a 100–200W heater depending on room temperature.",
    priceNpr: 4450,
    rating: 4.8,
    reviewCount: 94,
    category: "Tanks",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46aef011bacf?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "led-aquarium-light-18w",
    name: "LED Aquarium Light 18W",
    shortDescription: "Full-spectrum bar light with adjustable brackets.",
    description:
      "Energy-efficient LEDs with daylight spectrum to support low–medium light plants. Fits most rimmed tanks 45–60 cm. Splash-resistant housing.",
    priceNpr: 1200,
    rating: 4.4,
    reviewCount: 210,
    category: "Lighting",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "external-canister-filter",
    name: "External Canister Filter 800 L/h",
    shortDescription: "Quiet multi-stage filtration for tanks up to ~200 L.",
    description:
      "Includes mechanical, biological, and chemical media trays. Quick-disconnect valves for easy maintenance. Low-vibration motor suitable for living rooms.",
    priceNpr: 6800,
    rating: 4.7,
    reviewCount: 56,
    category: "Filtration",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "submersible-heater-100w",
    name: "Submersible Heater 100W",
    shortDescription: "Preset ~26°C with shatter-resistant quartz tube.",
    description:
      "Fully submersible heater with indicator light. Suitable for tanks roughly 60–120 L in average room conditions. Always use a reliable thermometer alongside any heater.",
    priceNpr: 950,
    rating: 4.3,
    reviewCount: 301,
    category: "Heating",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1524704654690-b56c05a4a5b7?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "tropical-flakes-500g",
    name: "Tropical Fish Flakes 500 g",
    shortDescription: "Balanced daily diet for community tropical fish.",
    description:
      "Fortified with vitamins and minerals. Feed small amounts 1–2 times daily. For best water quality, remove uneaten food after a few minutes.",
    priceNpr: 420,
    rating: 4.5,
    reviewCount: 512,
    category: "Food",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1520995930707-4d4c0a4b0bdb?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "river-pebbles-5kg",
    name: "Natural River Pebbles 5 kg",
    shortDescription: "Washed decorative substrate for aquascaping.",
    description:
      "Smooth rounded stones in mixed earth tones. Rinse thoroughly before use. Great for cichlid-style setups or as a top dressing over plant soil.",
    priceNpr: 580,
    rating: 4.2,
    reviewCount: 88,
    category: "Hardscape",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "air-pump-dual-outlet",
    name: "Air Pump with Dual Outlet",
    shortDescription: "Low-noise pump — great for sponge filters and airstones.",
    description:
      "Includes two adjustable airflow valves. Rubber feet reduce vibration. Ideal as backup aeration or for quarantine tubs.",
    priceNpr: 1100,
    rating: 4.1,
    reviewCount: 143,
    category: "Air",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1535591273668-5786947ff499?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "digital-ph-tester",
    name: "Digital pH Tester Pen",
    shortDescription: "Quick readings for planted tanks and discus keepers.",
    description:
      "Calibrate periodically per instructions. Rinse probe after each use and store with protective cap. Not a substitute for a full water test kit.",
    priceNpr: 2400,
    rating: 4.0,
    reviewCount: 67,
    category: "Testing",
    inStock: false,
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=800&fit=crop&q=80",
  },
  {
    slug: "coral-decoration-set",
    name: "Artificial Coral Decoration Set",
    shortDescription: "Saltwater look without the salinity — fish-safe resin.",
    description:
      "Three-piece set with weighted bases. Smooth edges; rinse before adding to the aquarium. Best for marine-style freshwater themes.",
    priceNpr: 1650,
    rating: 4.6,
    reviewCount: 39,
    category: "Decor",
    inStock: true,
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop&q=80",
  },
];

/** @deprecated Use seedProducts or lib/catalog on the client */
export const products = seedProducts;

export function getProductBySlug(slug: string): Product | undefined {
  return seedProducts.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return seedProducts.map((p) => p.slug);
}
