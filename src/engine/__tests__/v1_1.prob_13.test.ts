import { describe, expect, it } from "vitest";
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

describe("GREED IT V1.1 - règle 1/13 probabilité", () => {
  it("force 13 avec proba 20% quand bench contient 1", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [1],
      benchOnFire: false,
      discardUsesLeft: 1,
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
    expect(next.runStatus).toBe("RUNNING");
    expect(next.score).toBe(13);
  });

  it("si rng >= 0.2, tirage normal (pas forcé)", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [1],
      benchOnFire: false,
      discardUsesLeft: 1,
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

    const next = applyAction(state, { type: "FLIP" }, rngFrom([0.2, 0.1]));
    expect(next.bench).toContain(2);
    expect(next.score).toBe(2);
  });

  it("si carte cible indisponible, fallback normal même avec rng < 0.2", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [1],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {
        1: 0,
        2: 1,
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
        13: 0,
      },
      flipCount: 0,
      selfOvertakeTriggered: false,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, rngFrom([0.01, 0.7]));
    expect(next.bench).toContain(2);
    expect(next.score).toBe(2);
  });
});
