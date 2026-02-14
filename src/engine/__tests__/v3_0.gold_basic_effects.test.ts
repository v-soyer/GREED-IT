import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

const baseState = {
  bestScore: 0,
  previousRunScore: 999,
  pendingBonuses: [],
  streak: 0,
  runStatus: "RUNNING",
  score: 20,
  bench: [2, 9],
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
  },
  nextCardPreview: null,
  goldCap: 3,
  goldDrawnCount: 0,
  goldDrawnIds: [] as string[],
};

describe("GREED IT V3.0 - gold basic effects", () => {
  it("applique GOLD_PLUS_15", () => {
    const next = applyAction(
      { ...baseState, goldDeck: { GOLD_PLUS_15: 1 } } as any,
      { type: "FLIP" },
      () => 0.1,
    );
    expect(next.score).toBe(35);
    expect(next.goldDrawnCount).toBe(1);
    expect(next.goldDrawnIds).toEqual(["GOLD_PLUS_15"]);
  });

  it("applique GOLD_BENCH_GOLDEN", () => {
    const next = applyAction(
      { ...baseState, goldDeck: { GOLD_BENCH_GOLDEN: 1 } } as any,
      { type: "FLIP" },
      () => 0.1,
    );
    expect(next.score).toBe(30);
    expect(next.goldDrawnIds).toEqual(["GOLD_BENCH_GOLDEN"]);
  });
});
