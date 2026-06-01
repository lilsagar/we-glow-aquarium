"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isFirebaseConfigured() || isLoginPage || loading) return;
    if (!user || !isAdmin) {
      router.replace("/admin/login");
    }
  }, [user, loading, isAdmin, isLoginPage, router]);

  if (!isFirebaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-900">Firebase not configured</p>
        <p className="mt-2 text-sm text-red-800">
          Set NEXT_PUBLIC_FIREBASE_* environment variables to use the admin dashboard.
        </p>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-neutral-500">Checking admin session…</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-neutral-500">Redirecting to login…</p>
      </div>
    );
  }

  return <>{children}</>;
}
