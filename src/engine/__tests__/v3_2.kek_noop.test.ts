import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.2 - GOLD_KEK", () => {
  it("no-op sur score/bench", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 0,
      runStatus: "RUNNING",
      score: 12,
      bench: [2],
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
        precisionArmed: false,
        goldShieldAvailable: false,
      },
      nextCardPreview: null,
      goldCap: 3,
      goldDrawnCount: 0,
      goldDrawnIds: [],
      goldDeck: { GOLD_KEK: 1 },
      lastNormalValue: null,
      chainPending: false,
      pariPendingFlip: false,
      lastFlipKind: null,
      greedItOffered: false,
      greedItResolved: false,
      giPlus5Active: false,
      giTripleBonusActive: false,
      giGoldPlusActive: false,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(next.score).toBe(12);
    expect(next.bench).toEqual([2]);
  });
});
