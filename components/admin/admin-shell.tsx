"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100 lg:flex">
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-neutral-800 bg-black text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-5">
          <Link href="/admin" className="text-sm font-bold uppercase tracking-[0.2em]">
            We-Glow Admin
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <AdminSidebar onNavigate={() => setOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-neutral-200 text-black lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-black sm:text-xl">{title}</h1>
            {description ? (
              <p className="truncate text-xs text-neutral-500 sm:text-sm">{description}</p>
            ) : null}
          </div>
          <Link
            href="/"
            className="hidden shrink-0 rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black transition-colors hover:border-black sm:inline-flex"
          >
            View store
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
