import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V4.1 - GI_GOLD_PLUS", () => {
  it("start_run met goldCap=5 et 5 gold uniques", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      pendingGreedItBonus: "GI_GOLD_PLUS",
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

    const next = applyAction(state, { type: "START_RUN" }, () => 0.2);
    const entries = Object.entries(next.goldDeck).filter(([, count]) => (count ?? 0) > 0);

    expect(next.goldCap).toBe(5);
    expect(next.giGoldPlusActive).toBe(true);
    expect(entries).toHaveLength(5);
    expect(new Set(entries.map(([id]) => id)).size).toBe(5);
    expect(entries.every(([, count]) => count === 1)).toBe(true);
  });
});
