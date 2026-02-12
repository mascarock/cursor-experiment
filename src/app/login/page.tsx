"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/events";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, callbackUrl, redirect: false });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-bg-light dark:bg-bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Tech<span className="text-primary">Connect</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in with your email to get started
          </p>
        </div>

        {sent ? (
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <span className="material-icons-outlined text-5xl text-primary mb-4 block">
              mark_email_read
            </span>
            <h2 className="text-xl font-bold mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We sent a magic link to <strong className="text-slate-700 dark:text-slate-200">{email}</strong>.
              Click the link to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-icons-round text-sm animate-spin">
                  refresh
                </span>
              ) : (
                <>
                  <span>Send Magic Link</span>
                  <span className="material-icons-round text-sm">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
