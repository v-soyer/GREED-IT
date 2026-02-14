import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V4.1 - GI_TRIPLE_BONUS", () => {
  it("propose 3 bonus au STOP et accepte 3 sélections", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 0,
      runStatus: "RUNNING",
      score: 500,
      bench: [2, 3, 4],
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
      giTripleBonusActive: true,
      giGoldPlusActive: false,
    } as any;

    const stopped = applyAction(state, { type: "STOP" }, () => 0.3);
    expect(stopped.bonusOffer).toBeTruthy();
    expect(stopped.bonusOffer).toHaveLength(3);

    const selected = (stopped.bonusOffer ?? []).slice(0, 3);
    const chosen = applyAction(stopped, { type: "CHOOSE_BONUSES", payload: { selected } } as any);
    expect(chosen.pendingBonuses).toEqual(selected);
    expect(chosen.bonusChoiceLocked).toBe(true);
  });
});
