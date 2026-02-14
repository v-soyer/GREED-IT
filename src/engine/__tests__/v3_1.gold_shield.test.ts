import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.1 - GOLD_SHIELD", () => {
  it("protège un doublon avant SWAN/LOST puis se consomme", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 10,
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
        precisionArmed: false,
        goldShieldAvailable: false,
      },
      nextCardPreview: null,
      goldCap: 3,
      goldDrawnCount: 0,
      goldDrawnIds: [],
      goldDeck: { GOLD_SHIELD: 1 },
    } as any;

    const shielded = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(shielded.activeBonuses.goldShieldAvailable).toBe(true);

    const shieldedWithDeck = {
      ...shielded,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
    };
    const ignored = applyAction(shieldedWithDeck, { type: "FLIP" }, () => 0.1);
    expect(ignored.runStatus).toBe("RUNNING");
    expect(ignored.score).toBe(10);
    expect(ignored.activeBonuses.goldShieldAvailable).toBe(false);

    const lost = applyAction(ignored, { type: "FLIP" }, () => 0.1);
    expect(lost.runStatus).toBe("LOST");
  });
});
