"use client";

import { useRouter } from "next/navigation";
import PhoneShell from "@/components/PhoneShell";

export default function LoginPage() {
  const router = useRouter();

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
          <div className="text-lg font-semibold text-slate-900">Sleep Companion</div>
          <div className="text-sm text-slate-400">for Pokémon Sleep</div>
        </div>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/home");
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-zinc-500" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@email.com"
              className="border border-zinc-300 rounded-md px-3 py-3.5 text-[15px] bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-zinc-500" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border border-zinc-300 rounded-md px-3 py-3.5 text-[15px] bg-white"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-zinc-600 text-white text-[15px] font-semibold rounded-md py-3.5"
          >
            Log In
          </button>
        </form>

        <p className="text-xs text-zinc-400 text-center -mt-4">
          Not connected to real accounts yet — this takes you straight to Home for now.
        </p>

        <div className="text-sm text-zinc-400">
          Don&apos;t have an account? <span className="text-zinc-600 underline">Sign up</span>
        </div>
      </div>
    </PhoneShell>
  );
}
