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

describe("GREED IT V2.1 - flip safe", () => {
  it("reroll les doublons et garde un non-doublon si trouvé avant la limite", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [7],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 3, 8: 1, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
        flipSafeUsesLeft: 1,
        flipSafeArmed: false,
        resetForcedUsesLeft: 0,
      },
      nextCardPreview: null,
    } as any;

    const armed = applyAction(state, { type: "USE_BONUS", payload: { id: "FLIP_SAFE" } } as any);
    expect(armed.activeBonuses.flipSafeArmed).toBe(true);
    expect(armed.activeBonuses.flipSafeUsesLeft).toBe(0);

    const next = applyAction(armed, { type: "FLIP" }, rngFrom([0.1, 0.9]));
    expect(next.runStatus).toBe("RUNNING");
    expect(next.bench).toEqual([7, 8]);
    expect(next.activeBonuses.flipSafeArmed).toBe(false);
  });

  it("limite de reroll atteinte => on garde le dernier tirage doublon et LOST", () => {
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
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 4, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
        flipSafeArmed: true,
        resetForcedUsesLeft: 0,
      },
      nextCardPreview: null,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, rngFrom([0.1, 0.1, 0.1, 0.1]));
    expect(next.runStatus).toBe("LOST");
    expect(next.score).toBe(0);
    expect(next.activeBonuses.flipSafeArmed).toBe(false);
  });
});
