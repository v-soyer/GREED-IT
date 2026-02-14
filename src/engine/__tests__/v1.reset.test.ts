import { describe, expect, it } from "vitest";
import { createInitialDeck } from "../deck";
import { validateInvariants } from "../invariants";
import { applyAction } from "../reducer";
import { makeRngForValues } from "./helpers";

describe("GREED IT V1 - reset", () => {
  it("RESET_BENCH seulement quand onFire, puis remet bench vide et deck initial", () => {
    const rng = makeRngForValues([2, 3, 4, 5, 6, 7]);

    let state = applyAction(undefined, { type: "START_RUN" });
    const beforeOnFire = applyAction(state, { type: "RESET_BENCH" });
    expect(beforeOnFire).toEqual(state);

    for (let i = 0; i < 6; i += 1) {
      state = applyAction(state, { type: "FLIP" }, rng);
    }

    expect(state.benchOnFire).toBe(true);

    state = applyAction(state, { type: "RESET_BENCH" });
    expect(state.bench).toEqual([]);
    expect(state.benchOnFire).toBe(false);
    expect(state.deck).toEqual(createInitialDeck());
    expect(validateInvariants(state)).toEqual([]);
  });
});
