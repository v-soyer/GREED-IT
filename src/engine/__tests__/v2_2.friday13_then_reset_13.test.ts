import { describe, expect, it } from "vitest";
import { createInitialDeck } from "../deck";
import { applyAction } from "../reducer";

describe("GREED IT V2.2 - friday13 then auto reset 1/13", () => {
  it("si friday13 transforme en 13 alors bench 1+13 déclenche reset auto", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 20,
      bench: [1, 8],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 2, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
        friday13Available: true,
      },
      nextCardPreview: null,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, () => 0.9);

    expect(next.score).toBe(33);
    expect(next.bench).toEqual([]);
    expect(next.benchOnFire).toBe(false);
    expect(next.deck).toEqual(createInitialDeck());
    expect(next.activeBonuses.friday13Available).toBe(false);
  });
});
