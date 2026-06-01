"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CatalogProvider } from "@/components/providers/catalog-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { SiteChrome } from "@/components/site-chrome";

export function LayoutRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          {isAdmin ? children : <SiteChrome>{children}</SiteChrome>}
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}
