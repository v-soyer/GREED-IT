import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.0 - double this", () => {
  it("DOUBLE_THIS double le gain du prochain flip puis se désarme", () => {
    const base = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {
        1: 0,
        2: 1,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
      },
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
      bonusOffer: null,
      bonusChoiceLocked: false,
      activeBonuses: {
        peekUsesLeft: 0,
        doubleUsesLeft: 1,
        doubleNextFlipArmed: false,
      },
      nextCardPreview: null,
    } as any;

    const armed = applyAction(base, { type: "USE_BONUS", payload: { id: "DOUBLE_THIS" } } as any);
    expect(armed.activeBonuses.doubleUsesLeft).toBe(0);
    expect(armed.activeBonuses.doubleNextFlipArmed).toBe(true);

    const afterFlip = applyAction(armed, { type: "FLIP" }, () => 0);
    expect(afterFlip.score).toBe(4);
    expect(afterFlip.activeBonuses.doubleNextFlipArmed).toBe(false);
  });
});
