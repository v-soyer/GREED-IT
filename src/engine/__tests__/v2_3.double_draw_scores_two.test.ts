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

describe("GREED IT V2.3 - DOUBLE_DRAW", () => {
  it("tire 2 valeurs, score seulement, sans bench ni mort", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 10,
      bench: [7],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 1, 3: 1, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
        doubleDrawUsesLeft: 1,
        fuegoooEnabled: false,
      },
      nextCardPreview: null,
    } as any;

    const next = applyAction(state, { type: "USE_BONUS", payload: { id: "DOUBLE_DRAW" } } as any, rngFrom([0.1, 0.9]));

    expect(next.activeBonuses.doubleDrawUsesLeft).toBe(0);
    expect(next.score).toBe(15);
    expect(next.bench).toEqual([7]);
    expect(next.runStatus).toBe("RUNNING");
    expect(next.deck[2]).toBe(0);
    expect(next.deck[3]).toBe(0);
  });
});
