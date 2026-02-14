import { INITIAL_STATE } from "./constants";
import { createInitialDeck, takeValueFromDeck } from "./deck";
import { applyGiPlus5, randomPickOneGreedItBonus } from "./greedit/applyGreedIt";
import { applyGoldEffect } from "./gold/applyGold";
import type { GoldId } from "./gold/catalog";
import { createInitialGoldDeck, takeGoldFromDeck, type GoldDeck } from "./gold/goldDeck";
import { assertInvariants } from "./invariants";
import {
  applyOnYCroitMultiplier,
  canDiscard,
  canResetBench,
  computeBenchOnFire,
  computeFlipGain,
  getForcedOneThirteenTarget,
  isTerminalStatus,
  maybeApplyBenchCompleteBonus,
  maybeApplySelfOvertake,
  pickDistinctEligibleBonuses,
  previewNextDrawValueWithoutConsumingDeck,
  shouldAutoResetOneThirteen,
  shouldForceOneThirteen,
} from "./rules";
import type { Deck, GameAction, GameState } from "./types";

const maybeAssertInvariants = (state: GameState): GameState => {
  if (process.env.NODE_ENV !== "production") {
    assertInvariants(state);
  }
  return state;
};

const withActiveBonusesDefaults = (state: GameState): GameState["activeBonuses"] => ({
  peekUsesLeft: state.activeBonuses?.peekUsesLeft ?? 0,
  doubleUsesLeft: state.activeBonuses?.doubleUsesLeft ?? 0,
  doubleNextFlipArmed: state.activeBonuses?.doubleNextFlipArmed ?? false,
  swanShieldAvailable: state.activeBonuses?.swanShieldAvailable ?? false,
  deckSmartEnabled: state.activeBonuses?.deckSmartEnabled ?? false,
  flipSafeUsesLeft: state.activeBonuses?.flipSafeUsesLeft ?? 0,
  flipSafeArmed: state.activeBonuses?.flipSafeArmed ?? false,
  resetForcedUsesLeft: state.activeBonuses?.resetForcedUsesLeft ?? 0,
  friday13Available: state.activeBonuses?.friday13Available ?? false,
  onycActive: state.activeBonuses?.onycActive ?? false,
  doubleDrawUsesLeft: state.activeBonuses?.doubleDrawUsesLeft ?? 0,
  fuegoooEnabled: state.activeBonuses?.fuegoooEnabled ?? false,
  precisionArmed: state.activeBonuses?.precisionArmed ?? false,
  goldShieldAvailable: state.activeBonuses?.goldShieldAvailable ?? false,
});

const applyDeckSmart = (deck: Deck, value: number, deckSmartEnabled: boolean): Deck => {
  if (!deckSmartEnabled) return deck;
  const count = deck[value] ?? 0;
  if (count <= 0) return deck;
  return { ...deck, [value]: count - 1 };
};

type CombinedDrawResult =
  | { kind: "NORMAL"; value: number; deck: Deck; goldDeck: GoldDeck }
  | { kind: "GOLD"; id: GoldId; deck: Deck; goldDeck: GoldDeck };

const drawFromCombinedPools = (
  bench: number[],
  deck: Deck,
  goldDeck: GoldDeck,
  rng: () => number,
): CombinedDrawResult | null => {
  const forcedTarget = getForcedOneThirteenTarget(bench);
  if (forcedTarget != null && shouldForceOneThirteen(bench, deck[forcedTarget] ?? 0, rng)) {
    const forcedDeck = takeValueFromDeck(deck, forcedTarget);
    if (forcedDeck) {
      return { kind: "NORMAL", value: forcedTarget, deck: forcedDeck, goldDeck };
    }
  }

  type Entry = { key: string; weight: number };
  const entries: Entry[] = [];
  let total = 0;

  for (let value = 1; value <= 13; value += 1) {
    const count = deck[value] ?? 0;
    if (count > 0) {
      entries.push({ key: `N:${value}`, weight: count });
      total += count;
    }
  }

  for (const [id, count] of Object.entries(goldDeck) as Array<[GoldId, number]>) {
    if (count > 0) {
      entries.push({ key: `G:${id}`, weight: count });
      total += count;
    }
  }

  if (total <= 0) return null;

  let target = Math.floor(Math.max(0, Math.min(0.9999999999999999, rng())) * total);
  for (const entry of entries) {
    if (target < entry.weight) {
      if (entry.key.startsWith("N:")) {
        const value = Number(entry.key.slice(2));
        const nextDeck = takeValueFromDeck(deck, value);
        if (!nextDeck) return null;
        return { kind: "NORMAL", value, deck: nextDeck, goldDeck };
      }

      const id = entry.key.slice(2) as GoldId;
      return { kind: "GOLD", id, deck, goldDeck: takeGoldFromDeck(goldDeck, id) };
    }
    target -= entry.weight;
  }

  return null;
};

const buildRunningState = (state: GameState, rng: () => number): GameState => {
  const pendingBonuses = state.pendingBonuses ?? [];
  const giPlus5Active = state.pendingGreedItBonus === "GI_PLUS_5";
  const giTripleBonusActive = state.pendingGreedItBonus === "GI_TRIPLE_BONUS";
  const giGoldPlusActive = state.pendingGreedItBonus === "GI_GOLD_PLUS";
  const scoreInitial = state.pendingGreedItBonus === "GI_SCORE_SAVED" ? Math.floor(state.previousRunScore / 2) : 0;
  const goldCap = giGoldPlusActive ? 5 : 3;

  return {
    ...state,
    runStatus: "RUNNING",
    score: scoreInitial,
    bench: [],
    benchOnFire: false,
    discardUsesLeft: 1,
    deck: createInitialDeck(),
    flipCount: 0,
    selfOvertakeTriggered: false,
    benchCompleteTriggered: false,
    bonusOffer: null,
    bonusChoiceLocked: false,
    activeBonuses: {
      peekUsesLeft: pendingBonuses.includes("PEEK") ? 1 : 0,
      doubleUsesLeft: pendingBonuses.includes("DOUBLE_THIS") ? 1 : 0,
      doubleNextFlipArmed: false,
      swanShieldAvailable: pendingBonuses.includes("SWAN_SONG"),
      deckSmartEnabled: pendingBonuses.includes("DECK_SMART"),
      flipSafeUsesLeft: pendingBonuses.includes("FLIP_SAFE") ? 1 : 0,
      flipSafeArmed: false,
      resetForcedUsesLeft: pendingBonuses.includes("RESET_FORCED") ? 1 : 0,
      friday13Available: pendingBonuses.includes("FRIDAY_13"),
      onycActive: pendingBonuses.includes("ON_Y_CROIT"),
      doubleDrawUsesLeft: pendingBonuses.includes("DOUBLE_DRAW") ? 1 : 0,
      fuegoooEnabled: pendingBonuses.includes("FUEGOOO"),
      precisionArmed: false,
      goldShieldAvailable: false,
    },
    pendingBonuses: [],
    pendingGreedItBonus: null,
    nextCardPreview: null,
    goldCap,
    goldDrawnCount: 0,
    goldDrawnIds: [],
    goldDeck: createInitialGoldDeck(rng, goldCap),
    lastNormalValue: null,
    chainPending: false,
    pariPendingFlip: false,
    lastFlipKind: null,
    greedItOverride: false,
    streakMultiplier: 1,
    destinyFlipsLeft: 0,
    greedItOffered: false,
    greedItResolved: false,
    giPlus5Active,
    giTripleBonusActive,
    giGoldPlusActive,
  };
};

const performFlipTransition = (state: GameState, rng: () => number): GameState => {
  const nextActiveBonuses = withActiveBonusesDefaults(state);
  const stateGoldDeck = state.goldDeck ?? {};
  const chainPendingAtStart = state.chainPending;
  const pariPendingAtStart = state.pariPendingFlip;

  const precisionActive = nextActiveBonuses.precisionArmed;
  const flipSafeActive = !precisionActive && nextActiveBonuses.flipSafeArmed;

  if (precisionActive) {
    nextActiveBonuses.precisionArmed = false;
    if (nextActiveBonuses.flipSafeArmed) {
      nextActiveBonuses.flipSafeArmed = false;
    }
  } else if (flipSafeActive) {
    nextActiveBonuses.flipSafeArmed = false;
  }

  let draw = null as CombinedDrawResult | null;
  let workingDeck = state.deck;
  let workingGoldDeck = stateGoldDeck;
  const rerollActive = precisionActive || flipSafeActive;
  const maxAttempts = rerollActive ? 4 : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const attemptDraw = drawFromCombinedPools(state.bench, workingDeck, workingGoldDeck, rng);
    if (!attemptDraw) break;
    draw = attemptDraw;
    workingDeck = attemptDraw.deck;
    workingGoldDeck = attemptDraw.goldDeck;

    const isDuplicate = attemptDraw.kind === "NORMAL" && state.bench.includes(attemptDraw.value);
    const shouldRetry = rerollActive && isDuplicate && attempt < maxAttempts - 1;
    if (!shouldRetry) break;
  }

  if (!draw) {
    const nextScoreState = chainPendingAtStart
      ? maybeApplySelfOvertake(state.score, state.previousRunScore, state.selfOvertakeTriggered)
      : { score: state.score, selfOvertakeTriggered: state.selfOvertakeTriggered };
    return {
      ...state,
      score: nextScoreState.score,
      selfOvertakeTriggered: nextScoreState.selfOvertakeTriggered,
      activeBonuses: nextActiveBonuses,
      pariPendingFlip: false,
      chainPending: false,
      lastFlipKind: null,
    };
  }

  if (draw.kind === "GOLD") {
    let nextScore = state.score;
    let nextBench = state.bench;
    let nextDiscardUsesLeft = state.discardUsesLeft;
    let nextDeck = draw.deck;
    let nextGoldDeck = draw.goldDeck;
    let nextBonuses = nextActiveBonuses;
    let nextGoldDrawnCount = state.goldDrawnCount;
    let nextGoldDrawnIds = state.goldDrawnIds;
    let nextChainPending = state.chainPending;
    let nextPariPendingFlip = state.pariPendingFlip;
    let nextGreedItOverride = state.greedItOverride;
    let nextStreakMultiplier = state.streakMultiplier;
    let nextDestinyFlipsLeft = state.destinyFlipsLeft;

    if (state.goldDrawnCount < state.goldCap) {
      const goldResult = applyGoldEffect({
        id: draw.id,
        score: state.score,
        bench: state.bench,
        previousRunScore: state.previousRunScore,
        lastNormalValue: state.lastNormalValue,
        discardUsesLeft: state.discardUsesLeft,
        chainPending: state.chainPending,
        pariPendingFlip: state.pariPendingFlip,
        greedItOverride: state.greedItOverride,
        streakMultiplier: state.streakMultiplier,
        destinyFlipsLeft: state.destinyFlipsLeft,
        activeBonuses: nextActiveBonuses,
        deck: draw.deck,
        goldDeck: draw.goldDeck,
        rng,
      });
      nextScore = goldResult.score;
      nextBench = goldResult.bench;
      nextDiscardUsesLeft = goldResult.discardUsesLeft;
      nextChainPending = goldResult.chainPending;
      nextPariPendingFlip = goldResult.pariPendingFlip;
      nextBonuses = goldResult.activeBonuses;
      nextDeck = goldResult.deck;
      nextGoldDeck = goldResult.goldDeck;
      nextGreedItOverride = goldResult.greedItOverride;
      nextStreakMultiplier = goldResult.streakMultiplier;
      nextDestinyFlipsLeft = goldResult.destinyFlipsLeft;
      nextGoldDrawnCount = state.goldDrawnCount + 1;
      nextGoldDrawnIds = [...state.goldDrawnIds, draw.id];
    }

    if (chainPendingAtStart) {
      nextScore += 15;
      nextChainPending = false;
    }
    if (pariPendingAtStart) {
      nextPariPendingFlip = false;
    }

    const scoredState = maybeApplySelfOvertake(
      nextScore,
      state.previousRunScore,
      state.selfOvertakeTriggered,
    );

    return {
      ...state,
      deck: nextDeck,
      goldDeck: nextGoldDeck,
      bench: nextBench,
      score: scoredState.score,
      discardUsesLeft: nextDiscardUsesLeft,
      selfOvertakeTriggered: scoredState.selfOvertakeTriggered,
      goldDrawnCount: nextGoldDrawnCount,
      goldDrawnIds: nextGoldDrawnIds,
      greedItOverride: nextGreedItOverride,
      streakMultiplier: nextStreakMultiplier,
      destinyFlipsLeft: nextDestinyFlipsLeft,
      activeBonuses: nextBonuses,
      chainPending: nextChainPending,
      pariPendingFlip: nextPariPendingFlip,
      lastFlipKind: "GOLD",
      benchOnFire: computeBenchOnFire(nextBench, nextBonuses.fuegoooEnabled),
      flipCount: state.flipCount + 1,
    };
  }

  const deckAfterSmart = applyDeckSmart(draw.deck, draw.value, nextActiveBonuses.deckSmartEnabled);
  const wasDuplicate = state.bench.includes(draw.value);
  let resolvedValue = draw.value;

  if (wasDuplicate && nextActiveBonuses.friday13Available) {
    const has1 = state.bench.includes(1);
    const has13 = state.bench.includes(13);
    if (!(has1 && has13)) {
      const preferred = rng() < 0.5 ? 1 : 13;
      const alternative = preferred === 1 ? 13 : 1;
      resolvedValue = state.bench.includes(preferred) ? alternative : preferred;
      nextActiveBonuses.friday13Available = false;
    }
  }

  if (state.bench.includes(resolvedValue)) {
    if (nextActiveBonuses.goldShieldAvailable) {
      nextActiveBonuses.goldShieldAvailable = false;
      return {
        ...state,
        deck: deckAfterSmart,
        goldDeck: draw.goldDeck,
        activeBonuses: nextActiveBonuses,
        chainPending: false,
        pariPendingFlip: false,
        lastFlipKind: "DUP_IGNORED",
        flipCount: state.flipCount + 1,
      };
    }

    if (nextActiveBonuses.swanShieldAvailable) {
      nextActiveBonuses.swanShieldAvailable = false;
      return {
        ...state,
        deck: deckAfterSmart,
        goldDeck: draw.goldDeck,
        activeBonuses: nextActiveBonuses,
        chainPending: false,
        pariPendingFlip: false,
        lastFlipKind: "DUP_IGNORED",
        flipCount: state.flipCount + 1,
      };
    }

    return {
      ...state,
      runStatus: "LOST",
      score: 0,
      streak: 0,
      deck: deckAfterSmart,
      goldDeck: draw.goldDeck,
      activeBonuses: nextActiveBonuses,
      chainPending: false,
      pariPendingFlip: false,
      lastFlipKind: "LOST",
      flipCount: state.flipCount + 1,
    };
  }

  const nextBench = [...state.bench, resolvedValue];
  const nextFlipCount = state.flipCount + 1;
  let gain = computeFlipGain(
    resolvedValue,
    state.benchOnFire,
    state.streak,
    nextFlipCount,
    state.streakMultiplier,
  );
  if (nextActiveBonuses.doubleNextFlipArmed) {
    gain *= 2;
    nextActiveBonuses.doubleNextFlipArmed = false;
  }
  gain = applyOnYCroitMultiplier(gain, nextActiveBonuses.onycActive);
  gain = applyGiPlus5(gain, state.giPlus5Active);
  if (chainPendingAtStart) {
    gain += 15;
  }

  const scoredState = maybeApplySelfOvertake(
    state.score + gain,
    state.previousRunScore,
    state.selfOvertakeTriggered,
  );

  const shouldAutoReset = shouldAutoResetOneThirteen(nextBench);
  const finalBench = shouldAutoReset ? [] : nextBench;
  const finalDeck = shouldAutoReset ? createInitialDeck() : deckAfterSmart;

  if (shouldAutoReset && nextActiveBonuses.onycActive) {
    nextActiveBonuses.onycActive = false;
  }

  const benchCompleteState = maybeApplyBenchCompleteBonus(
    scoredState.score,
    finalBench,
    state.benchCompleteTriggered,
  );

  return {
    ...state,
    deck: finalDeck,
    goldDeck: draw.goldDeck,
    bench: finalBench,
    score: benchCompleteState.score,
    selfOvertakeTriggered: scoredState.selfOvertakeTriggered,
    benchCompleteTriggered: benchCompleteState.benchCompleteTriggered,
    activeBonuses: nextActiveBonuses,
    lastNormalValue: resolvedValue,
    chainPending: false,
    pariPendingFlip: pariPendingAtStart ? false : state.pariPendingFlip,
    lastFlipKind: "NORMAL_OK",
    benchOnFire: computeBenchOnFire(finalBench, nextActiveBonuses.fuegoooEnabled),
    flipCount: nextFlipCount,
  };
};

export const applyAction = (
  state: GameState = INITIAL_STATE,
  action: GameAction,
  rng: () => number = Math.random,
): GameState => {
  const canActOnWon =
    state.runStatus === "WON" &&
    (action.type === "CHOOSE_BONUSES" ||
      action.type === "ACCEPT_GREED_IT" ||
      action.type === "DECLINE_GREED_IT");

  if (isTerminalStatus(state.runStatus) && action.type !== "START_RUN" && !canActOnWon) {
    return maybeAssertInvariants(state);
  }

  switch (action.type) {
    case "START_RUN": {
      return maybeAssertInvariants(buildRunningState(state, rng));
    }

    case "FLIP": {
      if (state.runStatus !== "RUNNING") return maybeAssertInvariants(state);
      const scoreBeforeFlip = state.score;
      const destinyActiveOnFlip = state.destinyFlipsLeft > 0;
      const stateForFlip = destinyActiveOnFlip
        ? { ...state, destinyFlipsLeft: state.destinyFlipsLeft - 1 }
        : state;
      const afterFlip = performFlipTransition(stateForFlip, rng);

      if (afterFlip.runStatus === "LOST" && destinyActiveOnFlip) {
        return maybeAssertInvariants({
          ...stateForFlip,
          runStatus: "WON",
          score: scoreBeforeFlip,
          previousRunScore: scoreBeforeFlip,
          bestScore: Math.max(state.bestScore, scoreBeforeFlip),
          streak: state.streak + 1,
          bonusOffer: pickDistinctEligibleBonuses(
            scoreBeforeFlip,
            rng,
            state.giTripleBonusActive ? 3 : 2,
          ),
          bonusChoiceLocked: false,
          greedItOffered: false,
          greedItResolved: false,
        });
      }

      return maybeAssertInvariants(afterFlip);
    }

    case "DISCARD": {
      if (!canDiscard(state, action.payload.value)) return maybeAssertInvariants(state);

      const nextBench = state.bench.filter((v) => v !== action.payload.value);
      return maybeAssertInvariants({
        ...state,
        bench: nextBench,
        score: Math.max(0, state.score - action.payload.value),
        discardUsesLeft: state.discardUsesLeft - 1,
        benchOnFire: computeBenchOnFire(nextBench, state.activeBonuses.fuegoooEnabled),
      });
    }

    case "RESET_BENCH": {
      if (!canResetBench(state)) return maybeAssertInvariants(state);

      return maybeAssertInvariants({
        ...state,
        bench: [],
        benchOnFire: false,
        deck: createInitialDeck(),
        activeBonuses: {
          ...state.activeBonuses,
          onycActive: false,
        },
      });
    }

    case "STOP": {
      if (state.runStatus !== "RUNNING") return maybeAssertInvariants(state);
      if (state.pariPendingFlip) return maybeAssertInvariants(state);

      return maybeAssertInvariants({
        ...state,
        runStatus: "WON",
        previousRunScore: state.score,
        bestScore: Math.max(state.bestScore, state.score),
        streak: state.streak + 1,
        bonusOffer: pickDistinctEligibleBonuses(state.score, rng, state.giTripleBonusActive ? 3 : 2),
        bonusChoiceLocked: false,
        greedItOffered: state.benchOnFire || !!state.greedItOverride,
        greedItResolved: false,
      });
    }

    case "CHOOSE_BONUSES": {
      if (state.runStatus !== "WON") return maybeAssertInvariants(state);
      if (state.bonusChoiceLocked) return maybeAssertInvariants(state);
      if (!state.bonusOffer) return maybeAssertInvariants(state);

      const maxSelections = state.giTripleBonusActive ? 3 : 2;
      const selectedDistinct = [...new Set(action.payload.selected)];
      if (selectedDistinct.length > maxSelections) return maybeAssertInvariants(state);
      if (!selectedDistinct.every((id) => state.bonusOffer?.includes(id))) {
        return maybeAssertInvariants(state);
      }

      return maybeAssertInvariants({
        ...state,
        pendingBonuses: selectedDistinct,
        bonusChoiceLocked: true,
      });
    }

    case "USE_BONUS": {
      if (state.runStatus !== "RUNNING") return maybeAssertInvariants(state);

      if (action.payload.id === "PEEK" && state.activeBonuses.peekUsesLeft > 0) {
        return maybeAssertInvariants({
          ...state,
          activeBonuses: {
            ...state.activeBonuses,
            peekUsesLeft: state.activeBonuses.peekUsesLeft - 1,
          },
          nextCardPreview: previewNextDrawValueWithoutConsumingDeck(state.deck, state.rngSeed),
        });
      }

      if (action.payload.id === "DOUBLE_THIS" && state.activeBonuses.doubleUsesLeft > 0) {
        return maybeAssertInvariants({
          ...state,
          activeBonuses: {
            ...state.activeBonuses,
            doubleUsesLeft: state.activeBonuses.doubleUsesLeft - 1,
            doubleNextFlipArmed: true,
          },
        });
      }

      if (
        action.payload.id === "FLIP_SAFE" &&
        state.activeBonuses.flipSafeUsesLeft > 0 &&
        !state.activeBonuses.flipSafeArmed
      ) {
        return maybeAssertInvariants({
          ...state,
          activeBonuses: {
            ...state.activeBonuses,
            flipSafeUsesLeft: state.activeBonuses.flipSafeUsesLeft - 1,
            flipSafeArmed: true,
          },
        });
      }

      if (action.payload.id === "RESET_FORCED" && state.activeBonuses.resetForcedUsesLeft > 0) {
        return maybeAssertInvariants({
          ...state,
          score: Math.ceil(state.score * 0.9),
          bench: [],
          benchOnFire: false,
          deck: createInitialDeck(),
          activeBonuses: {
            ...state.activeBonuses,
            resetForcedUsesLeft: state.activeBonuses.resetForcedUsesLeft - 1,
            onycActive: false,
          },
        });
      }

      if (action.payload.id === "DOUBLE_DRAW" && state.activeBonuses.doubleDrawUsesLeft > 0) {
        let nextActiveBonuses = withActiveBonusesDefaults(state);
        const stateGoldDeck = state.goldDeck ?? {};
        nextActiveBonuses.doubleDrawUsesLeft -= 1;

        let nextDeck = state.deck;
        let nextGoldDeck = stateGoldDeck;
        let nextBench = state.bench;
        let nextDiscardUsesLeft = state.discardUsesLeft;
        let nextScore = state.score;
        let nextFlipCount = state.flipCount;
        let nextSelfOvertakeTriggered = state.selfOvertakeTriggered;
        let nextGoldDrawnCount = state.goldDrawnCount;
        let nextGoldDrawnIds = state.goldDrawnIds;
        let nextChainPending = state.chainPending;
        let nextPariPendingFlip = state.pariPendingFlip;
        let nextGreedItOverride = state.greedItOverride;
        let nextStreakMultiplier = state.streakMultiplier;
        let nextDestinyFlipsLeft = state.destinyFlipsLeft;

        for (let i = 0; i < 2; i += 1) {
          const draw = drawFromCombinedPools(state.bench, nextDeck, nextGoldDeck, rng);
          if (!draw) break;

          nextDeck = draw.deck;
          nextGoldDeck = draw.goldDeck;
          nextFlipCount += 1;

          if (draw.kind === "GOLD") {
            if (nextGoldDrawnCount < state.goldCap) {
              const goldResult = applyGoldEffect({
                id: draw.id,
                score: nextScore,
                bench: nextBench,
                previousRunScore: state.previousRunScore,
                lastNormalValue: state.lastNormalValue,
                discardUsesLeft: nextDiscardUsesLeft,
                chainPending: nextChainPending,
                pariPendingFlip: nextPariPendingFlip,
                greedItOverride: nextGreedItOverride,
                streakMultiplier: nextStreakMultiplier,
                destinyFlipsLeft: nextDestinyFlipsLeft,
                activeBonuses: nextActiveBonuses,
                deck: nextDeck,
                goldDeck: nextGoldDeck,
                rng,
              });
              nextScore = goldResult.score;
              nextBench = goldResult.bench;
              nextDiscardUsesLeft = goldResult.discardUsesLeft;
              nextChainPending = goldResult.chainPending;
              nextPariPendingFlip = goldResult.pariPendingFlip;
              nextGreedItOverride = goldResult.greedItOverride;
              nextStreakMultiplier = goldResult.streakMultiplier;
              nextDestinyFlipsLeft = goldResult.destinyFlipsLeft;
              nextDeck = goldResult.deck;
              nextGoldDeck = goldResult.goldDeck;
              nextActiveBonuses = goldResult.activeBonuses;
              nextGoldDrawnCount += 1;
              nextGoldDrawnIds = [...nextGoldDrawnIds, draw.id];
            }
          } else {
            nextDeck = applyDeckSmart(nextDeck, draw.value, nextActiveBonuses.deckSmartEnabled);

            let gain = computeFlipGain(
              draw.value,
              state.benchOnFire,
              state.streak,
              nextFlipCount,
              nextStreakMultiplier,
            );
            if (nextActiveBonuses.doubleNextFlipArmed) {
              gain *= 2;
              nextActiveBonuses.doubleNextFlipArmed = false;
            }
            gain = applyOnYCroitMultiplier(gain, nextActiveBonuses.onycActive);
            nextScore += gain;
          }

          const scoreState = maybeApplySelfOvertake(
            nextScore,
            state.previousRunScore,
            nextSelfOvertakeTriggered,
          );
          nextScore = scoreState.score;
          nextSelfOvertakeTriggered = scoreState.selfOvertakeTriggered;
        }

        return maybeAssertInvariants({
          ...state,
          deck: nextDeck,
          goldDeck: nextGoldDeck,
          bench: nextBench,
          discardUsesLeft: nextDiscardUsesLeft,
          score: nextScore,
          flipCount: nextFlipCount,
          selfOvertakeTriggered: nextSelfOvertakeTriggered,
          goldDrawnCount: nextGoldDrawnCount,
          goldDrawnIds: nextGoldDrawnIds,
          chainPending: nextChainPending,
          pariPendingFlip: nextPariPendingFlip,
          greedItOverride: nextGreedItOverride,
          streakMultiplier: nextStreakMultiplier,
          destinyFlipsLeft: nextDestinyFlipsLeft,
          activeBonuses: nextActiveBonuses,
          benchOnFire: computeBenchOnFire(nextBench, nextActiveBonuses.fuegoooEnabled),
        });
      }

      return maybeAssertInvariants(state);
    }

    case "DECLINE_GREED_IT": {
      if (state.runStatus !== "WON") return maybeAssertInvariants(state);
      return maybeAssertInvariants({
        ...state,
        greedItOffered: false,
        greedItResolved: true,
      });
    }

    case "ACCEPT_GREED_IT": {
      if (state.runStatus !== "WON" || !state.greedItOffered || state.greedItResolved) {
        return maybeAssertInvariants(state);
      }

      const greedFlip = performFlipTransition({ ...state, runStatus: "RUNNING" }, rng);
      if (greedFlip.runStatus === "LOST") {
        return maybeAssertInvariants({
          ...greedFlip,
          greedItOffered: false,
          greedItResolved: true,
        });
      }

      const picked = randomPickOneGreedItBonus(rng);
      const streak = picked === "GI_TRIPLE_STREAK" ? greedFlip.streak * 3 : greedFlip.streak;
      const pendingGreedItBonus = picked === "GI_TRIPLE_STREAK" ? null : picked;

      return maybeAssertInvariants({
        ...greedFlip,
        runStatus: "WON",
        streak,
        pendingGreedItBonus,
        greedItOffered: false,
        greedItResolved: true,
      });
    }

    default:
      return maybeAssertInvariants(state);
  }
};
