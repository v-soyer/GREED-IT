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

describe("GREED IT V3.1 - GOLD_PRECISION", () => {
  it("arme precision puis reroll anti-doublon au FLIP suivant", () => {
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
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
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
      goldDeck: { GOLD_PRECISION: 1 },
    } as any;

    const armed = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(armed.activeBonuses.precisionArmed).toBe(true);

    const armedWithDeck = {
      ...armed,
      deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 2, 8: 1, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 },
    };
    const after = applyAction(armedWithDeck, { type: "FLIP" }, rngFrom([0.1, 0.9]));
    expect(after.runStatus).toBe("RUNNING");
    expect(after.bench).toEqual([7, 8]);
    expect(after.activeBonuses.precisionArmed).toBe(false);
  });
});
