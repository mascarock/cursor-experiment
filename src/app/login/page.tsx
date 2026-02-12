"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/events";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      redirect: false,
    });

    if (result?.error) {
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="min-h-dvh bg-bg-light dark:bg-bg-dark flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Tech<span className="text-primary">Connect</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email to sign in or create an account
          </p>
        </div>

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
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
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
                <span>Continue with Email</span>
                <span className="material-icons-round text-sm">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6">
          A new account will be created automatically if you don&apos;t have one.
        </p>
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
