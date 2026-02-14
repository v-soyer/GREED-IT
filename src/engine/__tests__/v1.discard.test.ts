import { describe, expect, it } from "vitest";
import { validateInvariants } from "../invariants";
import { applyAction } from "../reducer";
import { makeRngForValues } from "./helpers";

describe("GREED IT V1 - discard", () => {
  it("discard retire la valeur, réduit le score et est unique", () => {
    const rng = makeRngForValues([2, 5, 8]);

    let state = applyAction(undefined, { type: "START_RUN" });
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);

    expect(state.score).toBe(15);

    state = applyAction(state, { type: "DISCARD", payload: { value: 5 } });
    expect(state.score).toBe(10);
    expect(state.bench).toEqual([2, 8]);
    expect(state.discardUsesLeft).toBe(0);

    const afterFirstDiscard = state;
    state = applyAction(state, { type: "DISCARD", payload: { value: 2 } });
    expect(state).toEqual(afterFirstDiscard);
    expect(validateInvariants(state)).toEqual([]);
  });
});
