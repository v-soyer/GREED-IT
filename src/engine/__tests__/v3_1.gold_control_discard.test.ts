import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.1 - GOLD_CONTROL + discardUsesLeft", () => {
  it("GOLD_CONTROL ajoute 1 use de discard et DISCARD consomme 1 use à chaque fois", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 20,
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
      goldDeck: { GOLD_CONTROL: 1 },
    } as any;

    let next = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(next.discardUsesLeft).toBe(2);

    next = applyAction(next, { type: "DISCARD", payload: { value: 2 } });
    expect(next.discardUsesLeft).toBe(1);

    next = applyAction(next, { type: "DISCARD", payload: { value: 3 } });
    expect(next.discardUsesLeft).toBe(0);
  });
});
