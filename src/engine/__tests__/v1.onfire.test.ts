import { describe, expect, it } from "vitest";
import { validateInvariants } from "../invariants";
import { applyAction } from "../reducer";
import { makeRngForValues } from "./helpers";

describe("GREED IT V1 - on fire", () => {
  it("le flip après activation onFire double le gain", () => {
    const rng = makeRngForValues([2, 3, 4, 5, 6, 7, 8]);

    let state = applyAction(undefined, { type: "START_RUN" });
    for (let i = 0; i < 7; i += 1) {
      state = applyAction(state, { type: "FLIP" }, rng);
    }

    expect(state.benchOnFire).toBe(true);
    expect(state.score).toBe(43);
    expect(validateInvariants(state)).toEqual([]);
  });
});
