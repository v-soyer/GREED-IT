import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.3 - ON_Y_CROIT", () => {
  it("multiplie les gains tant qu'aucun reset puis se désactive au reset", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [2, 3, 4, 5, 6, 7],
      benchOnFire: true,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
        friday13Available: false,
        onycActive: true,
        doubleDrawUsesLeft: 0,
        fuegoooEnabled: false,
      },
      nextCardPreview: null,
    } as any;

    const afterFlip = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(afterFlip.score).toBe(24);
    expect(afterFlip.activeBonuses.onycActive).toBe(true);

    const afterReset = applyAction(afterFlip, { type: "RESET_BENCH" });
    expect(afterReset.activeBonuses.onycActive).toBe(false);
  });
});
