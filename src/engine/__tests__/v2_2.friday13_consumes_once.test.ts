import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.2 - friday13 consumes once", () => {
  it("après usage, un nouveau doublon sans swan mène à LOST", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [7],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 2, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
      bonusOffer: null,
      bonusChoiceLocked: false,
      activeBonuses: {
        peekUsesLeft: 0,
        doubleUsesLeft: 0,
        doubleNextFlipArmed: false,
        swanShieldAvailable: false,
        deckSmartEnabled: false,
        flipSafeUsesLeft: 0,
        flipSafeArmed: false,
        resetForcedUsesLeft: 0,
        friday13Available: true,
      },
      nextCardPreview: null,
    } as any;

    const first = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(first.runStatus).toBe("RUNNING");
    expect(first.activeBonuses.friday13Available).toBe(false);

    const second = applyAction(first, { type: "FLIP" }, () => 0.1);
    expect(second.runStatus).toBe("LOST");
    expect(second.score).toBe(0);
  });
});
