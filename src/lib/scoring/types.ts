// Core domain types for the Phase 1 "rate a Pokémon" scoring logic.
// See /docs/scoring-spec.md for the full methodology this implements.

export type Specialty = "berry" | "ingredient" | "skill";

export type NatureStat =
  | "expGains"
  | "energyRecovery"
  | "ingredientFinding"
  | "mainSkillChance"
  | "speedOfHelp";

/** A Nature moves two stats (one up, one down), or is Neutral (both null). */
export interface Nature {
  up: NatureStat | null;
  down: NatureStat | null;
}

/** The two speed/trigger/finder subskills come in Small and Medium tiers. */
export type SubskillTier = "S" | "M" | "L";

export type SubskillId =
  // Gold
  | "berryFindingS"
  | "dreamShardBonus"
  | "energyRecoveryBonus"
  | "helpingBonus"
  | "researchExpBonus"
  | "skillLevelUpM"
  // Blue
  | "helpingSpeedM"
  | "inventoryUpM"
  | "inventoryUpL"
  | "skillLevelUpS"
  | "ingredientFinderM"
  | "skillTriggerM"
  // Grey
  | "helpingSpeedS"
  | "inventoryUpS"
  | "ingredientFinderS"
  | "skillTriggerS";

/** Raw 3-slot ingredient spread, e.g. "AAA", "AAB", "ABB". */
export type IngredientSpread = "AAA" | "AAB" | "AAC" | "ABB" | "ABA" | "ABC";

export interface PokemonCatch {
  specialty: Specialty;
  level: number;
  nature: Nature;
  spread: IngredientSpread;
  /** Only subskills already unlocked at this level should be included. */
  unlockedSubskills: SubskillId[];
}

export interface BucketScore {
  /** Raw multiplier value before comparison to the species ceiling. */
  actual: number;
  /** Same calculation assuming the best possible roll for this species. */
  ceiling: number;
  /** 0-100, actual as a % of ceiling, clamped. */
  score: number;
}

export interface ScoreResult {
  specialty: Specialty;
  ingredient: BucketScore;
  berry: BucketScore;
  skill: BucketScore;
  /** 0-100 overall, weighted toward the Pokémon's own specialty bucket. */
  overall: number;
  recommendation: "keep" | "keep-hunting";
}
