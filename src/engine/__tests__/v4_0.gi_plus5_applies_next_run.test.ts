import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V4.0 - GI_PLUS_5", () => {
  it("s'active sur la run suivante puis ajoute +5 sur chaque flip normal", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      pendingGreedItBonus: "GI_PLUS_5",
      streak: 0,
      runStatus: "WON",
      score: 0,
      bench: [],
      benchOnFire: false,
      discardUsesLeft: 0,
      deck: {},
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
      greedItOffered: false,
      greedItResolved: false,
      giPlus5Active: false,
    } as any;

    let next = applyAction(state, { type: "START_RUN" }, () => 0.1);
    expect(next.giPlus5Active).toBe(true);
    expect(next.pendingGreedItBonus).toBeNull();

    next = applyAction(next, { type: "FLIP" }, () => 0.02);
    expect(next.score).toBe(7);
  });
});
