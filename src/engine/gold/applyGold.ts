import { drawFromDeck, takeValueFromDeck, type Deck } from "../deck";
import { getForcedOneThirteenTarget, shouldForceOneThirteen } from "../rules";
import type { GameState } from "../types";
import { createInitialDeck } from "../deck";
import { addRandomGoldCards, type GoldDeck } from "./goldDeck";
import type { GoldId } from "./catalog";

export interface GoldEffectInput {
  id: GoldId;
  score: number;
  bench: number[];
  previousRunScore: number;
  lastNormalValue: number | null;
  discardUsesLeft: number;
  chainPending: boolean;
  pariPendingFlip: boolean;
  greedItOverride: boolean;
  streakMultiplier: number;
  destinyFlipsLeft: number;
  activeBonuses: GameState["activeBonuses"];
  deck: Deck;
  goldDeck: GoldDeck;
  rng: () => number;
}

export interface GoldEffectResult {
  score: number;
  bench: number[];
  discardUsesLeft: number;
  chainPending: boolean;
  pariPendingFlip: boolean;
  greedItOverride: boolean;
  streakMultiplier: number;
  destinyFlipsLeft: number;
  activeBonuses: GameState["activeBonuses"];
  deck: Deck;
  goldDeck: GoldDeck;
}

const drawNormalWithOneThirteenRule = (
  bench: number[],
  deck: Deck,
  rng: () => number,
): { value: number; deck: Deck } | null => {
  const forcedTarget = getForcedOneThirteenTarget(bench);
  if (forcedTarget != null && shouldForceOneThirteen(bench, deck[forcedTarget] ?? 0, rng)) {
    const forcedDeck = takeValueFromDeck(deck, forcedTarget);
    if (forcedDeck) {
      return { value: forcedTarget, deck: forcedDeck };
    }
  }

  return drawFromDeck(deck, rng);
};

export const applyGoldEffect = (input: GoldEffectInput): GoldEffectResult => {
  const {
    id,
    score,
    bench,
    previousRunScore,
    lastNormalValue,
    discardUsesLeft,
    chainPending,
    pariPendingFlip,
    greedItOverride,
    streakMultiplier,
    destinyFlipsLeft,
    activeBonuses,
    deck,
    goldDeck,
    rng,
  } = input;

  switch (id) {
    case "GOLD_PLUS_15":
      return {
        score: score + 15,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_MINUS_15":
      return {
        score: Math.max(0, score - 15),
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_BENCH_GOLDEN":
      return {
        score: score + 5 * bench.length,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_ECHO": {
      const echo = bench.length > 0 ? Math.max(...bench) : 0;
      return {
        score: score + echo,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    }
    case "GOLD_RESET":
      return {
        score,
        bench: [],
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses: { ...activeBonuses, onycActive: false },
        deck: createInitialDeck(),
        goldDeck,
      };
    case "GOLD_PRECISION":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses: { ...activeBonuses, precisionArmed: true },
        deck,
        goldDeck,
      };
    case "GOLD_SHIELD":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses: { ...activeBonuses, goldShieldAvailable: true },
        deck,
        goldDeck,
      };
    case "GOLD_CONTROL":
      return {
        score,
        bench,
        discardUsesLeft: discardUsesLeft + 1,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_LAST_X2":
      return {
        score: score + (lastNormalValue == null ? 0 : lastNormalValue * 2),
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_CHAIN":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending: true,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_THRESHOLD":
      return {
        score: score + (score > previousRunScore * 0.5 ? 20 : 5),
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_GREED_SERENE":
      return {
        score: score + (bench.length >= 5 ? 30 : 2),
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_BET":
      return {
        score: score + 20,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip: true,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_KEK":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_GREED_IT":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride: true,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_GOLD_AND_SILVER":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck: addRandomGoldCards(goldDeck, rng, 2, [id]),
      };
    case "GOLD_STREAK_GOLDEN":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier: 2,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_DESTINY":
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft: 2,
        activeBonuses,
        deck,
        goldDeck,
      };
    case "GOLD_ITS_ME_GREED": {
      let nextDeck = deck;
      const draws: number[] = [];
      for (let i = 0; i < 3; i += 1) {
        const drawn = drawNormalWithOneThirteenRule(bench, nextDeck, rng);
        if (!drawn) break;
        draws.push(drawn.value);
        nextDeck = drawn.deck;
      }

      const noneInBench = draws.length === 3 && draws.every((value) => !bench.includes(value));
      const bonus = noneInBench ? bench.reduce((sum, value) => sum + value, 0) : 0;

      return {
        score: score + bonus,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck: nextDeck,
        goldDeck,
      };
    }
    default:
      return {
        score,
        bench,
        discardUsesLeft,
        chainPending,
        pariPendingFlip,
        greedItOverride,
        streakMultiplier,
        destinyFlipsLeft,
        activeBonuses,
        deck,
        goldDeck,
      };
  }
};
