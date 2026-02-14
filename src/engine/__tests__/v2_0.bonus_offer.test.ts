import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.0 - bonus offer", () => {
  it("score 0 => aucune offre", () => {
    let state = applyAction(undefined, { type: "START_RUN" });
    state = applyAction(state, { type: "STOP" }, () => 0.1);

    expect(state.runStatus).toBe("WON");
    expect(state.bonusOffer).toBeNull();
  });

  it("score >= 80 => propose 2 bonus distincts quand possible", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 100,
      bench: [],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {},
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
      bonusOffer: null,
      bonusChoiceLocked: false,
      activeBonuses: {
        peekUsesLeft: 0,
        doubleUsesLeft: 0,
        doubleNextFlipArmed: false,
      },
      nextCardPreview: null,
    } as any;

    const next = applyAction(state, { type: "STOP" }, () => 0.6);

    expect(next.bonusOffer).toBeTruthy();
    expect(next.bonusOffer).toHaveLength(2);
    expect(new Set(next.bonusOffer ?? []).size).toBe(2);
  });
});
