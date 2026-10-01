"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneShell from "@/components/PhoneShell";
import { NATURE_NAMES } from "@/lib/scoring/natures";
import { ALL_SUBSKILL_IDS, SUBSKILL_LABELS, SUBSKILL_SLOT_LEVELS } from "@/lib/scoring/subskills";
import { IngredientSpread, Specialty } from "@/lib/scoring/types";

const SPREADS: IngredientSpread[] = ["AAA", "AAB", "AAC", "ABB", "ABA", "ABC"];

// There's no real screenshot-reading yet (that needs an AI vision call once
// accounts are wired up) — this form is a stand-in so the scoring engine and
// Result screen can be exercised end-to-end with real numbers today.
export default function UploadPage() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState<Specialty>("ingredient");
  const [level, setLevel] = useState(42);
  const [nature, setNature] = useState("Adamant");
  const [spread, setSpread] = useState<IngredientSpread>("AAB");
  const [slots, setSlots] = useState<string[]>(["", "", "", "", ""]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      specialty,
      level: String(level),
      nature,
      spread,
      slots: slots.join(","),
    });
    router.push(`/result?${params.toString()}`);
  }

  return (
    <PhoneShell>
      <div className="flex items-center gap-3.5 px-5 pt-5 pb-2.5">
        <button onClick={() => router.back()} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.8">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-base font-bold text-slate-900">Rate a Pokémon</div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-5 pb-6 flex flex-col gap-4 overflow-y-auto">
        <p className="text-xs text-zinc-500 leading-relaxed">
          Screenshot upload isn&apos;t wired up yet — enter what the Pokémon rolled and we&apos;ll run it
          through the real scoring formula.
        </p>

        <Field label="Specialty">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value as Specialty)}
            className="field"
          >
            <option value="berry">Berry</option>
            <option value="ingredient">Ingredient</option>
            <option value="skill">Skill</option>
          </select>
        </Field>

        <Field label="Level">
          <input
            type="number"
            min={1}
            max={80}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="field"
          />
        </Field>

        <Field label="Nature">
          <select value={nature} onChange={(e) => setNature(e.target.value)} className="field">
            {NATURE_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ingredient Spread">
          <select
            value={spread}
            onChange={(e) => setSpread(e.target.value as IngredientSpread)}
            className="field"
          >
            {SPREADS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex flex-col gap-2.5">
          <div className="text-xs uppercase tracking-wide text-zinc-500">Subskills</div>
          {SUBSKILL_SLOT_LEVELS.map((lvl, i) => (
            <Field key={lvl} label={`Lv ${lvl} slot`}>
              <select
                value={slots[i]}
                onChange={(e) =>
                  setSlots((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                }
                className="field"
              >
                <option value="">None</option>
                {ALL_SUBSKILL_IDS.map((id) => (
                  <option key={id} value={id}>
                    {SUBSKILL_LABELS[id]}
                  </option>
                ))}
              </select>
            </Field>
          ))}
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-zinc-600 text-white text-[15px] font-semibold rounded-md py-3.5"
        >
          Analyze
        </button>
      </form>
    </PhoneShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
