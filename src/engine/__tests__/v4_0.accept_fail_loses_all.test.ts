import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V4.0 - accept fail", () => {
  it("ACCEPT_GREED_IT en doublon => LOST, score=0, streak=0", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 4,
      runStatus: "WON",
      score: 30,
      bench: [5],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
        precisionArmed: false,
        goldShieldAvailable: false,
      },
      nextCardPreview: null,
      goldCap: 3,
      goldDrawnCount: 0,
      goldDrawnIds: [],
      goldDeck: {},
      greedItOffered: true,
      greedItResolved: false,
      giPlus5Active: false,
    } as any;

    const next = applyAction(state, { type: "ACCEPT_GREED_IT" } as any, () => 0.1);
    expect(next.runStatus).toBe("LOST");
    expect(next.score).toBe(0);
    expect(next.streak).toBe(0);
    expect(next.greedItResolved).toBe(true);
  });
});
