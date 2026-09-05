"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/lib/firebase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const credential = await signInWithEmailAndPassword(clientAuth, email, password);
      const idToken = await credential.user.getIdToken();

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("Could not start a session. Please try again.");

      router.push("/admin/orders");
      router.refresh();
    } catch {
      setError("Incorrect email or password.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-indigo-deep px-5">
      <div className="w-full max-w-sm rounded-xl bg-surface p-7">
        <h1 className="text-center text-xl font-semibold">Kitchen Admin</h1>
        <p className="mt-1 text-center text-[13px] text-ink-soft">Sign in to manage orders and the menu.</p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="mb-1 block text-xs text-ink-faint">Email</label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[13.5px]"
          />

          <label className="mt-3 mb-1 block text-xs text-ink-faint">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[13.5px]"
          />

          {error && <p className="mt-3 text-[13px] text-pepper">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-lg bg-indigo py-3 text-[13.5px] font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
