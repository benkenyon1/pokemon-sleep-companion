import Link from "next/link";
import PhoneShell from "@/components/PhoneShell";
import SignOutButton from "@/components/SignOutButton";

export default function HomePage() {
  return (
    <PhoneShell>
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="text-base font-bold text-slate-900">Sleep Companion</div>
        <SignOutButton />
      </div>

      <div className="px-5 pb-2 text-sm text-zinc-500">Welcome back, Trainer</div>

      <div className="flex-1 px-5 py-3 flex flex-col gap-4">
        <Link
          href="/upload"
          className="bg-zinc-600 rounded-[14px] px-[22px] py-[26px] flex flex-col gap-3.5 text-white"
        >
          <div className="w-11 h-11 rounded-[10px] bg-white/15 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13" r="3.4" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-bold">Rate a Pokémon</div>
            <div className="text-[13px] text-white/75 mt-1">
              Upload a screenshot to get a keep / hunt recommendation
            </div>
          </div>
          <div className="self-start bg-white text-zinc-800 text-[13px] font-semibold px-4 py-2.5 rounded-md">
            Start →
          </div>
        </Link>

        <div className="bg-white border border-dashed border-zinc-300 rounded-[14px] px-[22px] py-5 flex items-center gap-3.5 opacity-60">
          <div className="w-10 h-10 rounded-[10px] bg-slate-100 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.6">
              <path d="M4 4h6v16H4z" />
              <path d="M14 4h6v16h-6z" />
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-semibold text-zinc-600">My Library</div>
            <div className="text-xs text-zinc-400 mt-0.5">Coming soon — track every Pokémon you&apos;ve rated</div>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
