import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.2 - friday13 avoids duplicate", () => {
  it("sur doublon, friday13 convertit en 1 ou 13 non doublon et évite LOST", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 10,
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

    const next = applyAction(state, { type: "FLIP" }, () => 0.1);

    expect(next.runStatus).toBe("RUNNING");
    expect(next.bench).toEqual([7, 1]);
    expect(next.score).toBe(11);
    expect(next.activeBonuses.friday13Available).toBe(false);
  });
});
