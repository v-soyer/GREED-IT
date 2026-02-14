import { describe, expect, it } from "vitest";
import { createInitialDeck } from "../deck";
import { applyAction } from "../reducer";

describe("GREED IT V2.1 - reset forced", () => {
  it("RESET_FORCED applique ceil(score*0.9), vide bench, reset deck et est 1x", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 95,
      bench: [2, 3, 4],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 2, 4: 4, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
      flipCount: 3,
      selfOvertakeTriggered: true,
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
        resetForcedUsesLeft: 1,
      },
      nextCardPreview: null,
    } as any;

    const next = applyAction(state, { type: "USE_BONUS", payload: { id: "RESET_FORCED" } } as any);

    expect(next.score).toBe(86);
    expect(next.bench).toEqual([]);
    expect(next.benchOnFire).toBe(false);
    expect(next.deck).toEqual(createInitialDeck());
    expect(next.activeBonuses.resetForcedUsesLeft).toBe(0);

    const again = applyAction(next, { type: "USE_BONUS", payload: { id: "RESET_FORCED" } } as any);
    expect(again).toEqual(next);
  });
});
