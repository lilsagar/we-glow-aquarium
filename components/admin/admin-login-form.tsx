"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

const inputClass =
  "mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10";

export function AdminLoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          await signIn(email.trim(), password);
          router.replace("/admin");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Sign in failed. Check your credentials.",
          );
        } finally {
          setLoading(false);
        }
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
        Admin access
      </p>
      <h1 className="mt-2 text-2xl font-bold text-black">Sign in</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Use your Firebase Auth email and password. Only authorized admin emails can access
        the dashboard.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-black py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
