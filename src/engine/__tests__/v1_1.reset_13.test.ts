import { describe, expect, it } from "vitest";
import { createInitialDeck } from "../deck";
import { applyAction } from "../reducer";

const rngFrom = (values: number[]): (() => number) => {
  let i = 0;
  return () => {
    const next = values[i];
    i += 1;
    if (next == null) throw new Error("RNG sequence exhausted");
    return next;
  };
};

describe("GREED IT V1.1 - reset auto 1+13", () => {
  it("vide bench et reset deck immédiatement après FLIP de 13", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      streak: 0,
      runStatus: "RUNNING",
      score: 10,
      bench: [1],
      benchOnFire: false,
      discardUsesLeft: 0,
      deck: {
        1: 0,
        2: 2,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 1,
      },
      flipCount: 0,
      selfOvertakeTriggered: false,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, rngFrom([0.1]));

    expect(next.score).toBe(23);
    expect(next.bench).toEqual([]);
    expect(next.benchOnFire).toBe(false);
    expect(next.deck).toEqual(createInitialDeck());
    expect(next.discardUsesLeft).toBe(0);
  });
});
