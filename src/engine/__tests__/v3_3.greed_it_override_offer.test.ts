import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.3 - GOLD_GREED_IT", () => {
  it("force l'offre GREED IT au STOP même sans benchOnFire", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 0,
      runStatus: "RUNNING",
      score: 10,
      bench: [2, 3],
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
      goldDeck: { GOLD_GREED_IT: 1 },
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

    const withOverride = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(withOverride.greedItOverride).toBe(true);

    const stopped = applyAction(withOverride, { type: "STOP" }, () => 0.1);
    expect(stopped.runStatus).toBe("WON");
    expect(stopped.greedItOffered).toBe(true);
  });
});
