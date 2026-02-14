import { describe, expect, it } from "vitest";
import { createInitialDeck } from "../deck";
import { applyAction } from "../reducer";
import { makeRngForValues } from "./helpers";

describe("GREED IT V1.2 - bench complete 2..12", () => {
  it("multiplie le score par 10 quand bench contient 2..12 (une fois)", () => {
    const rng = makeRngForValues([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    let state = applyAction(undefined, { type: "START_RUN" });
    for (let i = 0; i < 11; i += 1) {
      state = applyAction(state, { type: "FLIP" }, rng);
    }

    expect(state.bench).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(state.score).toBe(1270);
    expect(state.benchCompleteTriggered).toBe(true);
  });

  it("ne se déclenche qu'une seule fois par run", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 500,
      streak: 0,
      runStatus: "RUNNING",
      score: 100,
      bench: [2],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {
        1: 0,
        2: 0,
        3: 1,
        4: 1,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
      },
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: true,
    } as any;

    const rng = makeRngForValues([3, 4]);

    const next1 = applyAction(state, { type: "FLIP" }, rng);
    expect(next1.score).toBe(103);

    const next2 = applyAction(next1, { type: "FLIP" }, rng);
    expect(next2.score).toBe(107);
    expect(next2.benchCompleteTriggered).toBe(true);
  });

  it("si reset auto 1/13 se produit, x10 ne se déclenche pas sur ce flip", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      streak: 0,
      runStatus: "RUNNING",
      score: 50,
      bench: [1, 13, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      benchOnFire: true,
      discardUsesLeft: 1,
      deck: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 1,
        13: 0,
      },
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, makeRngForValues([12]));

    expect(next.score).toBe(74);
    expect(next.bench).toEqual([]);
    expect(next.deck).toEqual(createInitialDeck());
    expect(next.benchCompleteTriggered).toBe(false);
  });
});
