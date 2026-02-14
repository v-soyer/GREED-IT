import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V4.1 - GI_SCORE_SAVED", () => {
  it("start_run initialise score à floor(previousRunScore/2)", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 101,
      pendingBonuses: [],
      pendingGreedItBonus: "GI_SCORE_SAVED",
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
      giTripleBonusActive: false,
      giGoldPlusActive: false,
    } as any;

    const next = applyAction(state, { type: "START_RUN" }, () => 0.1);
    expect(next.score).toBe(50);
    expect(next.pendingGreedItBonus).toBeNull();
  });
});
