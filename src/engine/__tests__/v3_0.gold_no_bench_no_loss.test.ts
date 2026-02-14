import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.0 - gold no bench no loss", () => {
  it("tirer une gold ne change pas bench et ne fait pas perdre", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 5,
      bench: [5],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
        onycActive: false,
        doubleDrawUsesLeft: 0,
        fuegoooEnabled: false,
      },
      nextCardPreview: null,
      goldCap: 3,
      goldDrawnCount: 0,
      goldDrawnIds: [],
      goldDeck: { GOLD_MINUS_15: 1 },
    } as any;

    const next = applyAction(state, { type: "FLIP" }, () => 0.1);

    expect(next.runStatus).toBe("RUNNING");
    expect(next.bench).toEqual([5]);
    expect(next.benchOnFire).toBe(false);
    expect(next.score).toBe(0);
  });
});
