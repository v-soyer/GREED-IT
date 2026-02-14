import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.1 - swan song", () => {
  it("premier doublon est annulé, second doublon fait LOST", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 2,
      runStatus: "RUNNING",
      score: 20,
      bench: [5],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
      bonusOffer: null,
      bonusChoiceLocked: false,
      activeBonuses: {
        peekUsesLeft: 0,
        doubleUsesLeft: 0,
        doubleNextFlipArmed: false,
        swanShieldAvailable: true,
        deckSmartEnabled: false,
        flipSafeUsesLeft: 0,
        flipSafeArmed: false,
        resetForcedUsesLeft: 0,
      },
      nextCardPreview: null,
    } as any;

    const first = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(first.runStatus).toBe("RUNNING");
    expect(first.score).toBe(20);
    expect(first.bench).toEqual([5]);
    expect(first.activeBonuses.swanShieldAvailable).toBe(false);

    const second = applyAction(first, { type: "FLIP" }, () => 0.1);
    expect(second.runStatus).toBe("LOST");
    expect(second.score).toBe(0);
    expect(second.streak).toBe(0);
  });
});
