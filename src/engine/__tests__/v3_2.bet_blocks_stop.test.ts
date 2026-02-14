import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V3.2 - GOLD_BET", () => {
  it("bloque STOP jusqu'à un FLIP, puis STOP redevient possible", () => {
    const state = {
      bestScore: 0,
      previousRunScore: 999,
      pendingBonuses: [],
      pendingGreedItBonus: null,
      streak: 0,
      runStatus: "RUNNING",
      score: 10,
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
      goldDeck: { GOLD_BET: 1 },
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

    const bet = applyAction(state, { type: "FLIP" }, () => 0.1);
    expect(bet.score).toBe(30);
    expect(bet.pariPendingFlip).toBe(true);

    const blockedStop = applyAction(bet, { type: "STOP" });
    expect(blockedStop).toEqual(bet);

    const afterFlip = applyAction(bet, { type: "FLIP" }, () => 0.1);
    expect(afterFlip.pariPendingFlip).toBe(false);

    const stopOk = applyAction(afterFlip, { type: "STOP" });
    expect(stopOk.runStatus).toBe("WON");
  });
});
