// Phase 1 "rate a Pokémon" scoring formula.
// Full methodology: /docs/scoring-spec.md (section 6a). Read that first —
// this file is the literal translation of it into code, step by step.

import {
  BucketScore,
  PokemonCatch,
  ScoreResult,
  Specialty,
  SubskillId,
} from "./types";
import {
  BASE_BERRIES_PER_ROLL,
  KEEP_THRESHOLD,
  NATURE_DELTA,
  SPECIALTY_WEIGHT,
  SPREAD_TIER_WEIGHT,
  SUBSKILL,
} from "./constants";

function has(subskills: SubskillId[], id: SubskillId): boolean {
  return subskills.includes(id);
}

/**
 * Multiplier on throughput (helps per unit time). Combines Speed of Help
 * (nature), Helping Speed (subskill), Helping Bonus (subskill, treated as
 * self-only for Phase 1), and Energy Recovery (nature).
 */
function throughputMultiplier(c: Pick<PokemonCatch, "nature" | "unlockedSubskills">): number {
  const speedOfHelpDelta =
    c.nature.up === "speedOfHelp"
      ? NATURE_DELTA.speedOfHelp.up
      : c.nature.down === "speedOfHelp"
        ? NATURE_DELTA.speedOfHelp.down
        : 0;

  const helpingSpeedDelta = has(c.unlockedSubskills, "helpingSpeedM")
    ? SUBSKILL.helpingSpeedM
    : has(c.unlockedSubskills, "helpingSpeedS")
      ? SUBSKILL.helpingSpeedS
      : 0;

  const helpingBonusDelta = has(c.unlockedSubskills, "helpingBonus") ? SUBSKILL.helpingBonus : 0;

  // All three are help-TIME deltas (negative = faster); throughput is their inverse.
  const helpTimeMultiplier = (1 + speedOfHelpDelta) * (1 + helpingSpeedDelta) * (1 + helpingBonusDelta);
  const perHelpThroughput = 1 / helpTimeMultiplier;

  const energyRecoveryDelta =
    c.nature.up === "energyRecovery"
      ? NATURE_DELTA.energyRecovery.up
      : c.nature.down === "energyRecovery"
        ? NATURE_DELTA.energyRecovery.down
        : 0;

  return perHelpThroughput * (1 + energyRecoveryDelta);
}

/** Positive = shifted toward ingredient rolls, negative = shifted toward berry rolls. */
function ingredientAllocationDelta(c: Pick<PokemonCatch, "nature" | "unlockedSubskills">): number {
  const natureDelta =
    c.nature.up === "ingredientFinding"
      ? NATURE_DELTA.ingredientFinding.up
      : c.nature.down === "ingredientFinding"
        ? NATURE_DELTA.ingredientFinding.down
        : 0;

  const subskillDelta = has(c.unlockedSubskills, "ingredientFinderM")
    ? SUBSKILL.ingredientFinderM
    : has(c.unlockedSubskills, "ingredientFinderS")
      ? SUBSKILL.ingredientFinderS
      : 0;

  return natureDelta + subskillDelta;
}

function inventoryUpBonus(unlockedSubskills: SubskillId[]): number {
  if (has(unlockedSubskills, "inventoryUpL")) return SUBSKILL.inventoryUpBonus.L;
  if (has(unlockedSubskills, "inventoryUpM")) return SUBSKILL.inventoryUpBonus.M;
  if (has(unlockedSubskills, "inventoryUpS")) return SUBSKILL.inventoryUpBonus.S;
  return 0;
}

function ingredientBucketValue(c: PokemonCatch): number {
  const throughput = throughputMultiplier(c);
  const allocation = 1 + ingredientAllocationDelta(c);
  const spreadWeight = SPREAD_TIER_WEIGHT[c.spread];

  // Inventory Up only prevents loss for Ingredient specialists — a full
  // basket converts their valuable ingredient rolls into guaranteed berries.
  const inventoryBonus = c.specialty === "ingredient" ? inventoryUpBonus(c.unlockedSubskills) : 0;

  return throughput * allocation * spreadWeight * (1 + inventoryBonus);
}

function berryBucketValue(c: PokemonCatch): number {
  const throughput = throughputMultiplier(c);
  const allocation = 1 - ingredientAllocationDelta(c);

  const baseBerries = BASE_BERRIES_PER_ROLL[c.specialty];
  const berryFindingMultiplier = has(c.unlockedSubskills, "berryFindingS")
    ? (baseBerries + SUBSKILL.berryFindingPerRoll) / baseBerries
    : 1;

  return throughput * allocation * berryFindingMultiplier;
}

function skillBucketValue(c: PokemonCatch): number {
  const throughput = throughputMultiplier(c);

  const triggerDelta = has(c.unlockedSubskills, "skillTriggerM")
    ? SUBSKILL.skillTriggerM
    : has(c.unlockedSubskills, "skillTriggerS")
      ? SUBSKILL.skillTriggerS
      : 0;

  const mainSkillChanceDelta =
    c.nature.up === "mainSkillChance"
      ? NATURE_DELTA.mainSkillChance.up
      : c.nature.down === "mainSkillChance"
        ? NATURE_DELTA.mainSkillChance.down
        : 0;

  // Inventory Up only matters here for Skill specialists who also run Berry
  // Finding S: their extra berries fill the basket fast, and once full they
  // stop getting skill-trigger opportunities at all. Secondary effect, so it
  // stacks on top rather than competing with trigger/speed for weight.
  const inventoryBonus =
    c.specialty === "skill" && has(c.unlockedSubskills, "berryFindingS")
      ? inventoryUpBonus(c.unlockedSubskills)
      : 0;

  return throughput * (1 + triggerDelta) * (1 + mainSkillChanceDelta) * (1 + inventoryBonus);
}

/** The best possible roll for this species, used as the denominator for each bucket. */
function ceilingFor(specialty: Specialty, bucket: "ingredient" | "berry" | "skill"): number {
  const allSubskills: SubskillId[] = [
    "helpingSpeedM",
    "helpingBonus",
    "ingredientFinderM",
    "skillTriggerM",
    "berryFindingS",
    "inventoryUpL",
  ];

  if (bucket === "ingredient") {
    return ingredientBucketValue({
      specialty,
      level: 60,
      nature: { up: "ingredientFinding", down: null },
      spread: "AAA",
      unlockedSubskills: allSubskills,
    });
  }

  if (bucket === "berry") {
    return berryBucketValue({
      specialty,
      level: 60,
      nature: { up: "ingredientFinding", down: null }, // "down" would favour berry more, but ceiling fixes one Nature for simplicity in this draft
      spread: "AAA",
      unlockedSubskills: allSubskills,
    });
  }

  return skillBucketValue({
    specialty,
    level: 60,
    nature: { up: "mainSkillChance", down: null },
    spread: "AAA",
    unlockedSubskills: allSubskills,
  });
}

function toBucketScore(actual: number, ceiling: number): BucketScore {
  const score = Math.max(0, Math.min(100, Math.round((actual / ceiling) * 100)));
  return { actual, ceiling, score };
}

export function scorePokemon(catchData: PokemonCatch): ScoreResult {
  const ingredient = toBucketScore(
    ingredientBucketValue(catchData),
    ceilingFor(catchData.specialty, "ingredient"),
  );
  const berry = toBucketScore(berryBucketValue(catchData), ceilingFor(catchData.specialty, "berry"));
  const skill = toBucketScore(skillBucketValue(catchData), ceilingFor(catchData.specialty, "skill"));

  const buckets = { ingredient, berry, skill };
  const ownScore = buckets[catchData.specialty].score;
  const otherScores = (["ingredient", "berry", "skill"] as const)
    .filter((b) => b !== catchData.specialty)
    .map((b) => buckets[b].score);

  const overall = Math.round(
    ownScore * SPECIALTY_WEIGHT.own + otherScores.reduce((sum, s) => sum + s * SPECIALTY_WEIGHT.other, 0),
  );

  return {
    specialty: catchData.specialty,
    ingredient,
    berry,
    skill,
    overall,
    recommendation: overall >= KEEP_THRESHOLD ? "keep" : "keep-hunting",
  };
}
