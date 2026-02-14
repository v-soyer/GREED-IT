import { MAX_CARD_VALUE, MIN_CARD_VALUE } from "./constants";
import { computeBenchOnFire } from "./rules";
import type { GameState } from "./types";

export const validateInvariants = (state: GameState): string[] => {
  const errors: string[] = [];

  if (state.score < 0) {
    errors.push("score must be >= 0");
  }

  if (new Set(state.bench).size !== state.bench.length) {
    errors.push("bench must contain unique values");
  }

  if (state.benchOnFire !== computeBenchOnFire(state.bench, state.activeBonuses?.fuegoooEnabled ?? false)) {
    errors.push("benchOnFire must match configured onFire threshold");
  }

  for (let v = MIN_CARD_VALUE; v <= MAX_CARD_VALUE; v += 1) {
    if ((state.deck[v] ?? 0) < 0) {
      errors.push(`deck count for ${v} must be >= 0`);
    }
  }

  return errors;
};

export const assertInvariants = (state: GameState): void => {
  const errors = validateInvariants(state);
  if (errors.length > 0) {
    throw new Error(`Engine invariants failed: ${errors.join("; ")}`);
  }
};
