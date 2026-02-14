import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";
import { makeRngForValues } from "./helpers";

describe("GREED IT V2.3 - FUEGOOO threshold", () => {
  it("avec FUEGOOO, onFire démarre à 5 cartes", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: ["FUEGOOO"],
      streak: 0,
      runStatus: "WON",
      score: 0,
      bench: [],
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
      },
      nextCardPreview: null,
    } as any;

    const rng = makeRngForValues([2, 3, 4, 5, 6]);
    let next = applyAction(state, { type: "START_RUN" });
    expect(next.activeBonuses.fuegoooEnabled).toBe(true);

    for (let i = 0; i < 5; i += 1) {
      next = applyAction(next, { type: "FLIP" }, rng);
    }

    expect(next.bench).toEqual([2, 3, 4, 5, 6]);
    expect(next.benchOnFire).toBe(true);
  });
});
