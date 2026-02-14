import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V4.0 - offer on fire only", () => {
  it("STOP propose greedIt seulement si benchOnFire=true", () => {
    const base = {
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

    const noOffer = applyAction(base, { type: "STOP" }, () => 0.1);
    expect(noOffer.greedItOffered).toBe(false);

    const offer = applyAction(
      { ...base, bench: [2, 3, 4, 5, 6, 7], benchOnFire: true } as any,
      { type: "STOP" },
      () => 0.1,
    );
    expect(offer.greedItOffered).toBe(true);
  });
});
