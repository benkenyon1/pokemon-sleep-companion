import Link from "next/link";
import PhoneShell from "@/components/PhoneShell";
import { NATURE_TABLE } from "@/lib/scoring/natures";
import { scorePokemon } from "@/lib/scoring/scorePokemon";
import { getUnlockedSubskills, SUBSKILL_LABELS, SUBSKILL_SLOT_LEVELS } from "@/lib/scoring/subskills";
import { IngredientSpread, Specialty, SubskillId } from "@/lib/scoring/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ResultPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const specialty = (params.specialty as Specialty) ?? "ingredient";
  const level = Number(params.level ?? 1);
  const natureName = (params.nature as string) ?? "Hardy";
  const spread = (params.spread as IngredientSpread) ?? "AAA";
  const slots = ((params.slots as string) ?? "").split(",") as (SubskillId | "")[];

  const nature = NATURE_TABLE[natureName] ?? { up: null, down: null };
  const assignedSlots = slots.map((s) => (s === "" ? null : (s as SubskillId)));
  const unlockedSubskills = getUnlockedSubskills(assignedSlots, level);

  const result = scorePokemon({ specialty, level, nature, spread, unlockedSubskills });

  const specialtyLabel = specialty === "ingredient" ? "Ingredients" : specialty === "berry" ? "Berries" : "Skills";
  const isKeep = result.recommendation === "keep";

  return (
    <PhoneShell>
      <div className="flex items-center gap-3.5 px-5 pt-[18px] pb-2.5">
        <Link href="/upload" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.8">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="text-base font-bold text-slate-900">Result</div>
      </div>

      <div className="flex-1 px-5 pb-4 flex flex-col gap-2.5 overflow-y-auto">
        {/* Identity */}
        <div className="bg-white border border-zinc-200 rounded-xl px-3.5 py-3 flex gap-3 items-center">
          <div className="w-[46px] h-[46px] rounded-lg bg-slate-100 border border-dashed border-zinc-300 shrink-0 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-slate-900">Pokémon Name</div>
            <div className="text-[11.5px] text-zinc-400 mt-0.5">
              Lv. {level} · {specialtyLabel.slice(0, -1)} specialist
            </div>
          </div>
          <div className="text-[11px] text-zinc-600 bg-slate-100 border border-zinc-200 rounded-full px-2.5 py-1 shrink-0">
            {specialtyLabel}
          </div>
        </div>

        {/* Ingredient spread */}
        <div className="bg-white border border-zinc-200 rounded-xl px-3.5 py-3">
          <div className="flex items-center justify-between">
            <CardLabel>Ingredient Spread</CardLabel>
            <div className="text-[15px] font-extrabold text-slate-900 tracking-wide">{spread}</div>
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            Score contribution: {result.ingredient.score}/100 vs. this species&apos; ceiling
          </div>
        </div>

        {/* Subskills */}
        <div className="bg-white border border-zinc-200 rounded-xl px-3.5 py-3">
          <CardLabel>Subskills</CardLabel>
          <div className="mt-1">
            {assignedSlots.map((id, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className="text-[10.5px] text-zinc-400 w-10 shrink-0">Lv {SUBSKILL_SLOT_LEVELS[i]}</div>
                <div
                  className={`text-[12.5px] ${
                    id && unlockedSubskills.includes(id) ? "text-zinc-700" : "text-zinc-400"
                  }`}
                >
                  {id ? SUBSKILL_LABELS[id] : "—"}
                  {id && !unlockedSubskills.includes(id) ? " (locked)" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nature */}
        <div className="bg-white border border-zinc-200 rounded-xl px-3.5 py-3">
          <CardLabel>Nature</CardLabel>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex flex-col gap-0.5">
              {nature.up && <div className="text-[13.5px] font-bold text-green-600">▲ {statLabel(nature.up)}</div>}
              {nature.down && <div className="text-[13.5px] font-bold text-red-600">▼ {statLabel(nature.down)}</div>}
              {!nature.up && !nature.down && <div className="text-[13.5px] text-zinc-400">Neutral</div>}
            </div>
            <div className="text-[11px] text-zinc-400 border border-zinc-200 rounded-full px-2.5 py-1">
              {natureName}
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="bg-white border border-zinc-200 rounded-xl px-3.5 py-3 flex items-center gap-3.5">
          <div className="text-[26px] font-extrabold text-slate-900 shrink-0">
            {result.overall}
            <span className="text-[13px] text-zinc-400 font-semibold">/100</span>
          </div>
          <div className="flex-1">
            <CardLabel>Overall Score</CardLabel>
            <div className="w-full h-[7px] bg-slate-100 rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-zinc-600" style={{ width: `${result.overall}%` }} />
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-zinc-700 rounded-xl px-3.5 py-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <div className="text-[14.5px] font-extrabold text-white tracking-wide">
              {isKeep ? "KEEP" : "KEEP HUNTING"}
            </div>
          </div>
          <div className="text-[11.5px] text-white/80 leading-relaxed">
            {specialtyLabel} score: {result[specialty].score}/100
            {" — "}
            {isKeep
              ? "a strong catch for its role."
              : "below this species' ceiling — worth hunting for a better roll."}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <Link
            href="/upload"
            className="flex-1 border border-zinc-300 rounded-md py-2.5 text-center text-[12.5px] font-semibold text-zinc-600"
          >
            Rate Another
          </Link>
          <div className="flex-1 bg-zinc-600 rounded-md py-2.5 text-center text-[12.5px] font-semibold text-white">
            Save to Library
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] uppercase tracking-wide text-zinc-400 font-semibold">{children}</div>;
}

function statLabel(stat: string) {
  switch (stat) {
    case "expGains":
      return "EXP Gains";
    case "energyRecovery":
      return "Energy Recovery";
    case "ingredientFinding":
      return "Ingredient Finding";
    case "mainSkillChance":
      return "Main Skill Chance";
    case "speedOfHelp":
      return "Speed of Help";
    default:
      return stat;
  }
}
