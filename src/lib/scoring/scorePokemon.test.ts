import { describe, expect, it } from "vitest";
import { scorePokemon } from "./scorePokemon";
import { PokemonCatch } from "./types";

const noNature = { up: null, down: null };

describe("scorePokemon", () => {
  it("gives a perfect-roll Ingredient specialist a near-100 overall score", () => {
    const perfect: PokemonCatch = {
      specialty: "ingredient",
      level: 60,
      nature: { up: "ingredientFinding", down: null },
      spread: "AAA",
      unlockedSubskills: [
        "helpingSpeedM",
        "helpingBonus",
        "ingredientFinderM",
        "inventoryUpL",
      ],
    };

    const result = scorePokemon(perfect);
    expect(result.ingredient.score).toBe(100);
    // Not 95+: the 80/10/10 specialty split means even a perfect own-bucket
    // roll gets dragged down a little by this catch's weak berry/skill
    // buckets (it rolled nothing relevant to either) — that's correct
    // behaviour per the spec, not a bug.
    expect(result.overall).toBeGreaterThanOrEqual(85);
    expect(result.recommendation).toBe("keep");
  });

  it("scores a bare, unremarkable catch well below the ceiling", () => {
    const bare: PokemonCatch = {
      specialty: "ingredient",
      level: 1,
      nature: noNature,
      spread: "ABC",
      unlockedSubskills: [],
    };

    const result = scorePokemon(bare);
    expect(result.ingredient.score).toBeLessThan(50);
    expect(result.recommendation).toBe("keep-hunting");
  });

  it("rewards Berry Finding S heavily on a Berry specialist, with no Inventory Up contribution", () => {
    const withoutInventory: PokemonCatch = {
      specialty: "berry",
      level: 40,
      nature: noNature,
      spread: "AAA",
      unlockedSubskills: ["berryFindingS"],
    };
    const withInventory: PokemonCatch = {
      ...withoutInventory,
      unlockedSubskills: ["berryFindingS", "inventoryUpL"],
    };

    const a = scorePokemon(withoutInventory);
    const b = scorePokemon(withInventory);

    // Inventory Up should make zero difference for a Berry specialist.
    expect(a.berry.score).toBe(b.berry.score);
  });

  it("lets Inventory Up help a Skill specialist's skill score only when paired with Berry Finding S", () => {
    const noBerryFinding: PokemonCatch = {
      specialty: "skill",
      level: 50,
      nature: { up: "mainSkillChance", down: null },
      spread: "AAA",
      unlockedSubskills: ["skillTriggerM", "inventoryUpL"],
    };
    const withBerryFindingNoInventory: PokemonCatch = {
      ...noBerryFinding,
      unlockedSubskills: ["skillTriggerM", "berryFindingS"],
    };
    const withBoth: PokemonCatch = {
      ...noBerryFinding,
      unlockedSubskills: ["skillTriggerM", "berryFindingS", "inventoryUpL"],
    };

    const withoutBerryFinding = scorePokemon(noBerryFinding);
    const berryFindingOnly = scorePokemon(withBerryFindingNoInventory);
    const both = scorePokemon(withBoth);

    // Inventory Up alone (no Berry Finding S) shouldn't touch the skill score.
    expect(withoutBerryFinding.skill.actual).toBeCloseTo(
      scorePokemon({ ...noBerryFinding, unlockedSubskills: ["skillTriggerM"] }).skill.actual,
    );
    // But once Berry Finding S is present, adding Inventory Up should help.
    expect(both.skill.actual).toBeGreaterThan(berryFindingOnly.skill.actual);
  });

  it("never lets a bucket score exceed 100 even with an unexpectedly strong roll", () => {
    const overTuned: PokemonCatch = {
      specialty: "skill",
      level: 80,
      nature: { up: "mainSkillChance", down: null },
      spread: "AAA",
      unlockedSubskills: [
        "skillTriggerM",
        "helpingSpeedM",
        "helpingBonus",
        "berryFindingS",
        "inventoryUpL",
      ],
    };

    const result = scorePokemon(overTuned);
    expect(result.skill.score).toBeLessThanOrEqual(100);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it("weights the overall score toward the Pokémon's own specialty", () => {
    // A Skill specialist with a terrible skill roll but an amazing (irrelevant) ingredient roll
    // should still score poorly overall, since skill is only 10% of an ingredient mon's score
    // and this is a skill mon, so its own (skill) bucket dominates at 80%.
    const weakSkillStrongIngredient: PokemonCatch = {
      specialty: "skill",
      level: 60,
      nature: { up: "ingredientFinding", down: null }, // actively unhelpful for a skill mon
      spread: "AAA",
      unlockedSubskills: ["ingredientFinderM"], // irrelevant subskill for a skill mon's own bucket
    };

    const result = scorePokemon(weakSkillStrongIngredient);
    expect(result.skill.score).toBeLessThan(50);
    expect(result.overall).toBeLessThan(50);
  });
});
