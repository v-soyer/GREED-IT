import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

const rngFrom = (values: number[]): (() => number) => {
  let i = 0;
  return () => {
    const next = values[i];
    i += 1;
    if (next == null) throw new Error("RNG sequence exhausted");
    return next;
  };
};

describe("GREED IT V4.1 - GI_TRIPLE_STREAK", () => {
  it("accept greed it et gain GI_TRIPLE_STREAK => streak*3, pas de pending", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 2,
      runStatus: "WON",
      score: 20,
      bench: [],
      benchOnFire: true,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
      greedItOffered: true,
      greedItResolved: false,
      giPlus5Active: false,
      giTripleBonusActive: false,
      giGoldPlusActive: false,
    } as any;

    const next = applyAction(state, { type: "ACCEPT_GREED_IT" } as any, rngFrom([0.1, 0.95]));

    expect(next.runStatus).toBe("WON");
    expect(next.streak).toBe(6);
    expect(next.pendingGreedItBonus).toBeNull();
    expect(next.greedItResolved).toBe(true);
  });
});
