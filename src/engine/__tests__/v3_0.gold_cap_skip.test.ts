import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.0 - gold cap skip", () => {
  it("au-delà du cap, la gold est consommée mais effet/compteurs de tirage ignorés", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 50,
      bench: [4, 8],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
      flipCount: 3,
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
      goldDrawnCount: 3,
      goldDrawnIds: ["GOLD_PLUS_15", "GOLD_ECHO", "GOLD_MINUS_15"],
      goldDeck: { GOLD_PLUS_15: 1 },
    } as any;

    const next = applyAction(state, { type: "FLIP" }, () => 0.2);

    expect(next.score).toBe(50);
    expect(next.goldDrawnCount).toBe(3);
    expect(next.goldDrawnIds).toEqual(["GOLD_PLUS_15", "GOLD_ECHO", "GOLD_MINUS_15"]);
    expect(next.goldDeck.GOLD_PLUS_15).toBe(0);
  });
});
