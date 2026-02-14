import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.2 - friday13 priority over swan", () => {
  it("friday13 s'applique avant swan quand possible", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 5,
      bench: [6],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 2, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
      bonusOffer: null,
      bonusChoiceLocked: false,
      activeBonuses: {
        peekUsesLeft: 0,
        doubleUsesLeft: 0,
        doubleNextFlipArmed: false,
        swanShieldAvailable: true,
        deckSmartEnabled: false,
        flipSafeUsesLeft: 0,
        flipSafeArmed: false,
        resetForcedUsesLeft: 0,
        friday13Available: true,
      },
      nextCardPreview: null,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, () => 0.1);

    expect(next.runStatus).toBe("RUNNING");
    expect(next.bench).toEqual([6, 1]);
    expect(next.score).toBe(6);
    expect(next.activeBonuses.friday13Available).toBe(false);
    expect(next.activeBonuses.swanShieldAvailable).toBe(true);
  });

  it("si friday13 impossible (1 et 13 déjà bench), swan prend le relais", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      streak: 0,
      runStatus: "RUNNING",
      score: 7,
      bench: [1, 13, 9],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 2, 10: 0, 11: 0, 12: 0, 13: 0 },
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
      bonusOffer: null,
      bonusChoiceLocked: false,
      activeBonuses: {
        peekUsesLeft: 0,
        doubleUsesLeft: 0,
        doubleNextFlipArmed: false,
        swanShieldAvailable: true,
        deckSmartEnabled: false,
        flipSafeUsesLeft: 0,
        flipSafeArmed: false,
        resetForcedUsesLeft: 0,
        friday13Available: true,
      },
      nextCardPreview: null,
    } as any;

    const next = applyAction(state, { type: "FLIP" }, () => 0.1);

    expect(next.runStatus).toBe("RUNNING");
    expect(next.score).toBe(7);
    expect(next.bench).toEqual([1, 13, 9]);
    expect(next.activeBonuses.friday13Available).toBe(true);
    expect(next.activeBonuses.swanShieldAvailable).toBe(false);
  });
});
