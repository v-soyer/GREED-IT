import { describe, expect, it } from "vitest";
import { validateInvariants } from "../invariants";
import { applyAction } from "../reducer";
import type { GameState } from "../types";
import { makeRngForValues } from "./helpers";

describe("GREED IT V1 - streak bonus", () => {
  it("avec streak=3, bonus +3 à partir du 3e flip", () => {
    const rng = makeRngForValues([2, 3, 4, 5]);

    let state: GameState = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 3,
      runStatus: "IDLE",
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
        precisionArmed: false,
        goldShieldAvailable: false,
      },
      nextCardPreview: null,
      goldCap: 3,
      goldDrawnCount: 0,
      goldDrawnIds: [],
      goldDeck: {},
      lastNormalValue: null,
      chainPending: false,
      pariPendingFlip: false,
      lastFlipKind: null,
      greedItOverride: false,
      streakMultiplier: 1,
      destinyFlipsLeft: 0,
      greedItOffered: false,
      greedItResolved: false,
      giPlus5Active: false,
      giTripleBonusActive: false,
      giGoldPlusActive: false,
    };

    state = applyAction(state, { type: "START_RUN" });
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);
    state = applyAction(state, { type: "FLIP" }, rng);

    expect(state.score).toBe(20);
    expect(validateInvariants(state)).toEqual([]);
  });
});
