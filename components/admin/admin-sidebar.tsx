"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();

  return (
    <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Admin navigation">
      {user?.email ? (
        <p className="mb-2 truncate px-4 text-xs text-neutral-500">{user.email}</p>
      ) : null}
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-black"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
      <div className="my-4 border-t border-neutral-800" />
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
      >
        <Store className="size-5 shrink-0" aria-hidden />
        Back to store
      </Link>
      <button
        type="button"
        onClick={async () => {
          await signOut();
          onNavigate?.();
          router.replace("/admin/login");
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
      >
        <LogOut className="size-5 shrink-0" aria-hidden />
        Sign out
      </button>
    </nav>
  );
}
