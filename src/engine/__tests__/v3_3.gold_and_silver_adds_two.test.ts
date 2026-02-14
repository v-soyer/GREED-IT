import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.3 - GOLD_GOLD_AND_SILVER", () => {
  it("ajoute 2 gold cards uniques au goldDeck", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [],
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
      goldDeck: { GOLD_GOLD_AND_SILVER: 1 },
      lastNormalValue: null,
      chainPending: false,
      pariPendingFlip: false,
      lastFlipKind: null,
      greedItOverride: false,
      destinyFlipsLeft: 0,
      streakMultiplier: 1,
      greedItOffered: false,
      greedItResolved: false,
      giPlus5Active: false,
      giTripleBonusActive: false,
      giGoldPlusActive: false,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, () => 0.1);
    const activeGoldIds = Object.entries(next.goldDeck)
      .filter(([, count]) => (count ?? 0) > 0)
      .map(([id]) => id);

    expect(activeGoldIds.length).toBe(2);
    expect(new Set(activeGoldIds).size).toBe(2);
  });
});
