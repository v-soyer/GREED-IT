import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.2 - GOLD_CHAIN", () => {
  it("chainPending puis flip GOLD => +15 puis consommé", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 0,
      runStatus: "RUNNING",
      score: 0,
      bench: [],
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
      goldDeck: { GOLD_CHAIN: 1 },
      lastNormalValue: null,
      chainPending: false,
      pariPendingFlip: false,
      lastFlipKind: null,
      greedItOffered: false,
      greedItResolved: false,
      giPlus5Active: false,
      giTripleBonusActive: false,
      giGoldPlusActive: false,
    } as any;

    const armed = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(armed.chainPending).toBe(true);

    const triggered = applyAction({ ...armed, goldDeck: { GOLD_KEK: 1 } } as any, { type: "FLIP" }, () => 0.1);
    expect(triggered.score).toBe(15);
    expect(triggered.chainPending).toBe(false);

    const dupIgnored = applyAction({ ...armed, bench: [5], deck: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 }, goldDeck: {}, activeBonuses: { ...armed.activeBonuses, swanShieldAvailable: true } } as any, { type: "FLIP" }, () => 0.1);
    expect(dupIgnored.lastFlipKind).toBe("DUP_IGNORED");
    expect(dupIgnored.score).toBe(0);
    expect(dupIgnored.chainPending).toBe(false);
  });
});
