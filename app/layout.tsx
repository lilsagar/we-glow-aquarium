import type { Metadata } from "next";
import { LayoutRoot } from "@/components/layout-root";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "We-Glow Aquarium",
    template: "%s · We-Glow Aquarium",
  },
  description:
    "Beginner-friendly demo aquarium store built with Next.js — tanks, filters, food, and supplies priced in NPR.",
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
