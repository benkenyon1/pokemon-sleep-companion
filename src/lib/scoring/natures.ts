import { Nature } from "./types";

/** Full Nature name -> stat pair table, confirmed against the game (spec section 5). */
export const NATURE_TABLE: Record<string, Nature> = {
  Hardy: { up: null, down: null },
  Docile: { up: null, down: null },
  Serious: { up: null, down: null },
  Bashful: { up: null, down: null },
  Quirky: { up: null, down: null },

  Bold: { up: "energyRecovery", down: "speedOfHelp" },
  Impish: { up: "energyRecovery", down: "ingredientFinding" },
  Lax: { up: "energyRecovery", down: "mainSkillChance" },
  Relaxed: { up: "energyRecovery", down: "expGains" },

  Hasty: { up: "expGains", down: "energyRecovery" },
  Jolly: { up: "expGains", down: "ingredientFinding" },
  Naive: { up: "expGains", down: "mainSkillChance" },
  Timid: { up: "expGains", down: "speedOfHelp" },

  Adamant: { up: "speedOfHelp", down: "ingredientFinding" },
  Brave: { up: "speedOfHelp", down: "expGains" },
  Lonely: { up: "speedOfHelp", down: "energyRecovery" },
  Naughty: { up: "speedOfHelp", down: "mainSkillChance" },

  Calm: { up: "mainSkillChance", down: "speedOfHelp" },
  Careful: { up: "mainSkillChance", down: "ingredientFinding" },
  Gentle: { up: "mainSkillChance", down: "energyRecovery" },
  Sassy: { up: "mainSkillChance", down: "expGains" },

  Mild: { up: "ingredientFinding", down: "energyRecovery" },
  Modest: { up: "ingredientFinding", down: "speedOfHelp" },
  Quiet: { up: "ingredientFinding", down: "expGains" },
  Rash: { up: "ingredientFinding", down: "mainSkillChance" },
};

export const NATURE_NAMES = Object.keys(NATURE_TABLE);
