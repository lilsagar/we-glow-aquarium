import type { Metadata } from "next";
import { LayoutRoot } from "@/components/layout-root";
import "./globals.css";

const siteUrl = "https://we-glow-aquarium.example.com";
const siteImage = "/placeholder.png";

export const metadata: Metadata = {
  title: {
    default: "We Glow Aquarium",
    template: "%s · We Glow Aquarium",
  },
  description:
    "Premium aquarium supplies in Nepal — tanks, filters, lighting, decor, and fish care essentials priced in NPR.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "Nepal aquarium supplies",
    "aquarium equipment Nepal",
    "fish tank accessories",
    "aquarium decor",
    "aquarium lighting",
    "aquarium filters",
    "NPR aquarium store",
  ],
  openGraph: {
    title: "We Glow Aquarium",
    description:
      "Premium aquarium supplies in Nepal — tanks, filters, lighting, decor, and fish care essentials.",
    url: siteUrl,
    siteName: "We Glow Aquarium",
    images: [siteImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "We Glow Aquarium",
    description:
      "Premium aquarium supplies in Nepal — tanks, filters, lighting, decor, and fish care essentials.",
    images: [siteImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-100 text-neutral-900">
        <LayoutRoot>{children}</LayoutRoot>
      </body>
    </html>
  );
}
