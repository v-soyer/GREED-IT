import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.0 - peek preview", () => {
  it("USE_BONUS PEEK définit preview et ne consomme pas le deck", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {
        1: 1,
        2: 2,
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
        peekUsesLeft: 1,
        doubleUsesLeft: 0,
        doubleNextFlipArmed: false,
      },
      nextCardPreview: null,
      rngSeed: 123,
    } as any;

    const beforeDeck = { ...state.deck };
    const next = applyAction(state, { type: "USE_BONUS", payload: { id: "PEEK" } } as any);

    expect(next.activeBonuses.peekUsesLeft).toBe(0);
    expect(next.nextCardPreview).not.toBeNull();
    expect(next.deck).toEqual(beforeDeck);
  });
});
