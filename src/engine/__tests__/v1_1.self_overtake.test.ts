import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";
import { makeRngForValues } from "./helpers";

describe("GREED IT V1.1 - depassement de soi", () => {
  it("ajoute +10% de previousRunScore une seule fois quand score dépasse", () => {
    const initial = {
      bestScore: 0,
      previousRunScore: 50,
      streak: 0,
      runStatus: "IDLE",
      score: 0,
      bench: [],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {},
      flipCount: 0,
      selfOvertakeTriggered: false,
    } as any;

    const rng = makeRngForValues([8, 9, 10, 11, 12, 7, 6]);

    let state = applyAction(initial, { type: "START_RUN" });
    state = applyAction(state, { type: "FLIP" }, rng);

    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);

    expect(state.score).toBe(62);
    expect(state.selfOvertakeTriggered).toBe(true);

    state = applyAction(state, { type: "FLIP" }, rng);
    expect(state.score).toBe(74);
  });

  it("si previousRunScore=0, bonus 0 mais flag trigger true", () => {
    const initial = {
      bestScore: 0,
      previousRunScore: 0,
      streak: 0,
      runStatus: "IDLE",
      score: 0,
      bench: [],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {},
      flipCount: 0,
      selfOvertakeTriggered: false,
    } as any;

    const rng = makeRngForValues([2]);

    let state = applyAction(initial, { type: "START_RUN" });
    state = applyAction(state, { type: "FLIP" }, rng);

    expect(state.score).toBe(2);
    expect(state.selfOvertakeTriggered).toBe(true);
  });
});
