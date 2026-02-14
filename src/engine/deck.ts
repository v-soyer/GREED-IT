import { INITIAL_DECK_COUNTS, MAX_CARD_VALUE, MIN_CARD_VALUE } from "./constants";
import type { Deck } from "./types";

export const createInitialDeck = (): Deck => ({ ...INITIAL_DECK_COUNTS });

export const getDeckTotal = (deck: Deck): number => {
  let total = 0;
  for (let v = MIN_CARD_VALUE; v <= MAX_CARD_VALUE; v += 1) {
    total += deck[v] ?? 0;
  }
  return total;
};

export const drawFromDeck = (deck: Deck, rng: () => number): { value: number; deck: Deck } | null => {
  const total = getDeckTotal(deck);
  if (total <= 0) return null;

  const boundedRoll = Math.max(0, Math.min(0.9999999999999999, rng()));
  let target = Math.floor(boundedRoll * total);

  const nextDeck: Deck = { ...deck };
  for (let value = MIN_CARD_VALUE; value <= MAX_CARD_VALUE; value += 1) {
    const count = nextDeck[value] ?? 0;
    if (count <= 0) continue;

    if (target < count) {
      nextDeck[value] = count - 1;
      return { value, deck: nextDeck };
    }

    target -= count;
  }

  return null;
};

export const takeValueFromDeck = (deck: Deck, value: number): Deck | null => {
  const count = deck[value] ?? 0;
  if (count <= 0) return null;
  return { ...deck, [value]: count - 1 };
};
