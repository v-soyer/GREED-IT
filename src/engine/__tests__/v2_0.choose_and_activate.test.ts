import { describe, expect, it } from "vitest";
import { applyAction } from "../reducer";

describe("GREED IT V2.0 - choose and activate", () => {
  it("STOP -> CHOOSE_BONUSES -> START_RUN active les bonus puis vide pending", () => {
    const wonState = {
      bestScore: 0,
      previousRunScore: 0,
      pendingBonuses: [],
      streak: 0,
      runStatus: "WON",
      score: 90,
      bench: [],
      benchOnFire: false,
      discardUsesLeft: 1,
      deck: {},
      flipCount: 0,
      selfOvertakeTriggered: false,
      benchCompleteTriggered: false,
      bonusOffer: ["PEEK", "DOUBLE_THIS"],
      bonusChoiceLocked: false,
      activeBonuses: {
        peekUsesLeft: 0,
        doubleUsesLeft: 0,
        doubleNextFlipArmed: false,
      },
      nextCardPreview: null,
    } as any;

    let state = applyAction(wonState, {
      type: "CHOOSE_BONUSES",
      payload: { selected: ["PEEK", "DOUBLE_THIS"] },
    } as any);

    expect(state.pendingBonuses).toEqual(["PEEK", "DOUBLE_THIS"]);
    expect(state.bonusChoiceLocked).toBe(true);

    state = applyAction(state, { type: "START_RUN" });

    expect(state.runStatus).toBe("RUNNING");
    expect(state.activeBonuses.peekUsesLeft).toBe(1);
    expect(state.activeBonuses.doubleUsesLeft).toBe(1);
    expect(state.activeBonuses.doubleNextFlipArmed).toBe(false);
    expect(state.pendingBonuses).toEqual([]);
  });
});
