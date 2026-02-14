import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.0 - gold start run", () => {
  it("START_RUN initialise 3 gold distinctes count=1", () => {
    const state = applyAction(undefined, { type: "START_RUN" }, () => 0.1234);
    const entries = Object.entries(state.goldDeck).filter(([, count]) => (count ?? 0) > 0);

    expect(entries).toHaveLength(3);
    expect(new Set(entries.map(([id]) => id)).size).toBe(3);
    expect(entries.every(([, count]) => count === 1)).toBe(true);
    expect(state.goldCap).toBe(3);
    expect(state.goldDrawnCount).toBe(0);
    expect(state.goldDrawnIds).toEqual([]);
  });
});
