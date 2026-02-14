import { createInitialDeck, getDeckTotal } from "../deck";

export const makeRngForValues = (values: number[]): (() => number) => {
  const deck = createInitialDeck();
  let index = 0;

  return () => {
    const value = values[index];
    if (value == null) {
      throw new Error("RNG sequence exhausted");
    }
    index += 1;

    const total = getDeckTotal(deck);
    let offset = 0;

    for (let v = 1; v <= 13; v += 1) {
      const count = deck[v] ?? 0;
      if (count <= 0) continue;

      if (v === value) {
        deck[v] = count - 1;
        return (offset + 0.5) / total;
      }

      offset += count;
    }

    throw new Error(`Cannot draw value ${value}, it is not available in deck`);
  };
};
