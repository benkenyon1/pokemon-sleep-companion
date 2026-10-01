"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import PhoneShell from "@/components/PhoneShell";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    // If email confirmation is on, Supabase returns a user but no session —
    // there's nothing to redirect into yet, so show a "check your email" state.
    if (data.user && !data.session) {
      setIsDone(true);
      setIsSubmitting(false);
      return;
    }

    // Email confirmation is off: signUp already created a session, so the
    // proxy's session check will let the user straight into /home.
    router.push("/home");
    router.refresh();
  }

  if (isDone) {
    return (
      <PhoneShell>
        <div className="flex-1 flex flex-col items-center justify-center px-7 gap-4 text-center">
          <div className="text-lg font-semibold text-slate-900">Check your email</div>
          <p className="text-sm text-zinc-500">
            We sent a confirmation link to <span className="font-medium text-zinc-700">{email}</span>. Follow it,
            then come back and log in.
          </p>
          <Link href="/login" className="text-sm text-zinc-600 underline mt-2">
            Back to log in
          </Link>
        </div>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <div className="flex-1 flex flex-col items-center px-7 pt-16 pb-10 gap-10">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-400 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-slate-900">Create account</div>
          <div className="text-sm text-slate-400">for Pokémon Sleep</div>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-zinc-500" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-zinc-500" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600 -mt-1">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full bg-zinc-600 text-white text-[15px] font-semibold rounded-md py-3.5 disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <div className="text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-600 underline">
            Log in
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
