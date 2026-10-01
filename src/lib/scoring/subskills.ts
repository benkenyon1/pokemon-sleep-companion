import { SubskillId } from "./types";

export const SUBSKILL_SLOT_LEVELS = [10, 25, 50, 70, 80] as const;

export const SUBSKILL_LABELS: Record<SubskillId, string> = {
  berryFindingS: "Berry Finding S",
  dreamShardBonus: "Dream Shard Bonus",
  energyRecoveryBonus: "Energy Recovery Bonus",
  helpingBonus: "Helping Bonus",
  researchExpBonus: "Research EXP Bonus",
  skillLevelUpM: "Skill Level Up M",
  helpingSpeedM: "Helping Speed M",
  inventoryUpM: "Inventory Up M",
  inventoryUpL: "Inventory Up L",
  skillLevelUpS: "Skill Level Up S",
  ingredientFinderM: "Ingredient Finder M",
  skillTriggerM: "Skill Trigger M",
  helpingSpeedS: "Helping Speed S",
  inventoryUpS: "Inventory Up S",
  ingredientFinderS: "Ingredient Finder S",
  skillTriggerS: "Skill Trigger S",
};

export const ALL_SUBSKILL_IDS = Object.keys(SUBSKILL_LABELS) as SubskillId[];

/**
 * Subskills are visible from the point of catching, but only take effect
 * once the Pokémon reaches that slot's unlock level (10/25/50/70/80).
 * `assigned` is the 5 subskills a catch rolled, in slot order; this returns
 * only the ones currently active at `level`.
 */
export function getUnlockedSubskills(
  assigned: (SubskillId | null)[],
  level: number,
): SubskillId[] {
  return assigned
    .map((id, i) => (id && level >= SUBSKILL_SLOT_LEVELS[i] ? id : null))
    .filter((id): id is SubskillId => id !== null);
}
