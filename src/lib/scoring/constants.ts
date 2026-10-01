// All magic numbers for the Phase 1 scoring formula, pulled from
// /docs/scoring-spec.md. Anything marked PLACEHOLDER is a reasonable guess
// Claude proposed rather than a number confirmed from the game, and should
// be revisited once we can sanity-check scores against real Pokémon.

import { IngredientSpread, NatureStat } from "./types";

/** Nature stat swing sizes. Positive = helps the stat, negative = hurts it. */
export const NATURE_DELTA: Record<NatureStat, { up: number; down: number }> = {
  ingredientFinding: { up: 0.2, down: -0.2 },
  mainSkillChance: { up: 0.2, down: -0.2 },
  // Speed of Help was deliberately patched asymmetric: the down side is
  // softer than the up side is strong.
  speedOfHelp: { up: -0.1, down: 0.05 }, // expressed as help-TIME delta (negative = faster)
  expGains: { up: 0.2, down: -0.2 }, // x1.20 / x0.80, not folded into the 0-100 score (footnote only)
  energyRecovery: { up: 0.2, down: -0.12 }, // x1.20 / x0.88, also deliberately asymmetric
};

/** Subskill effect sizes. */
export const SUBSKILL = {
  helpingSpeedS: -0.07, // help-time delta
  helpingSpeedM: -0.14,
  helpingBonus: -0.05, // party-wide per copy; Phase 1 treats as self-only (see spec 6a)
  skillTriggerS: 0.18,
  skillTriggerM: 0.36,
  ingredientFinderS: 0.18, // reallocated from berry rolls
  ingredientFinderM: 0.36,
  berryFindingPerRoll: 1, // +1 berry per berry roll
  inventoryUpBonus: { S: 0.05, M: 0.1, L: 0.15 }, // PLACEHOLDER magnitudes
} as const;

/** Baseline berries produced per berry roll, before Berry Finding S. */
export const BASE_BERRIES_PER_ROLL = {
  berry: 2,
  ingredient: 1,
  skill: 1,
} as const;

/**
 * Ingredient Spread tier weight. AAA is a deliberate major bonus, not just
 * the top of a gentle curve — confirmed by Ben, PLACEHOLDER only in that the
 * exact gap size (vs. a "true" recipe-aware score) may move once we add
 * account/recipe context in a later phase.
 */
export const SPREAD_TIER_WEIGHT: Record<IngredientSpread, number> = {
  AAA: 1.0,
  AAB: 0.4, // "AAX"
  AAC: 0.4, // "AAX"
  ABB: 0.5, // best *for the B ingredient specifically* — caveat shown in UI copy
  ABA: 0.1,
  ABC: 0.1,
};

/** How much of the overall score comes from the Pokémon's own specialty bucket. */
export const SPECIALTY_WEIGHT = {
  own: 0.8,
  other: 0.1,
} as const; // PLACEHOLDER — Ben said "mostly for themselves", may want to push even further

/** Overall score at/above this is a "keep" rather than "keep hunting". PLACEHOLDER. */
export const KEEP_THRESHOLD = 70;
