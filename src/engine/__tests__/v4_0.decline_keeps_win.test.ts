import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V4.0 - decline", () => {
  it("DECLINE_GREED_IT garde WON et ferme l'offre", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 10,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 1,
      runStatus: "WON",
      score: 40,
      bench: [2, 3, 4, 5, 6, 7],
      benchOnFire: true,
      discardUsesLeft: 1,
      deck: {},
      flipCount: 6,
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

    const next = applyAction(state, { type: "DECLINE_GREED_IT" } as any);
    expect(next.runStatus).toBe("WON");
    expect(next.score).toBe(40);
    expect(next.greedItOffered).toBe(false);
    expect(next.greedItResolved).toBe(true);
  });
});
