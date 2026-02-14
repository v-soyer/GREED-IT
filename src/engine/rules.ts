import { getEligible, type BonusId } from "./bonus/catalog";
import { drawFromDeck } from "./deck";
import type { Deck, GameState, RunStatus } from "./types";

export const isTerminalStatus = (status: RunStatus): boolean => status === "WON" || status === "LOST";

export const getOnFireThreshold = (fuegoooEnabled: boolean): number => (fuegoooEnabled ? 5 : 6);

export const computeBenchOnFire = (bench: number[], fuegoooEnabled = false): boolean =>
  bench.length >= getOnFireThreshold(fuegoooEnabled);

export const computeFlipGain = (
  value: number,
  benchOnFireBeforeFlip: boolean,
  streak: number,
  flipIndex: number,
  streakMultiplier = 1,
): number => {
  let gain = value;

  if (benchOnFireBeforeFlip) {
    gain *= 2;
  }

  if (streak > 0 && flipIndex >= streak) {
    gain += streak * streakMultiplier;
  }

  return gain;
};

export const canDiscard = (state: GameState, value: number): boolean => {
  if (state.runStatus !== "RUNNING") return false;
  if (state.discardUsesLeft <= 0) return false;
  return state.bench.includes(value);
};

export const canResetBench = (state: GameState): boolean =>
  state.runStatus === "RUNNING" && state.benchOnFire;

export const getForcedOneThirteenTarget = (bench: number[]): number | null => {
  const has1 = bench.includes(1);
  const has13 = bench.includes(13);
  if (has1 === has13) return null;
  return has1 ? 13 : 1;
};

export const shouldForceOneThirteen = (
  bench: number[],
  deckCountForTarget: number,
  rng: () => number,
): boolean => {
  if (getForcedOneThirteenTarget(bench) == null) return false;
  if (deckCountForTarget <= 0) return false;
  return rng() < 0.2;
};

export const shouldAutoResetOneThirteen = (bench: number[]): boolean =>
  bench.includes(1) && bench.includes(13);

export const maybeApplySelfOvertake = (
  score: number,
  previousRunScore: number,
  selfOvertakeTriggered: boolean,
): { score: number; selfOvertakeTriggered: boolean } => {
  if (selfOvertakeTriggered) {
    return { score, selfOvertakeTriggered };
  }

  if (score > previousRunScore) {
    const bonus = Math.ceil(previousRunScore * 0.1);
    return { score: score + bonus, selfOvertakeTriggered: true };
  }

  return { score, selfOvertakeTriggered };
};

export const hasBenchCompleteTwoToTwelve = (bench: number[]): boolean => {
  for (let value = 2; value <= 12; value += 1) {
    if (!bench.includes(value)) return false;
  }
  return true;
};

export const maybeApplyBenchCompleteBonus = (
  score: number,
  bench: number[],
  benchCompleteTriggered: boolean,
): { score: number; benchCompleteTriggered: boolean } => {
  if (benchCompleteTriggered) {
    return { score, benchCompleteTriggered };
  }

  if (hasBenchCompleteTwoToTwelve(bench)) {
    return { score: score * 10, benchCompleteTriggered: true };
  }

  return { score, benchCompleteTriggered };
};

export const applyOnYCroitMultiplier = (gain: number, onycActive: boolean): number =>
  onycActive ? Math.ceil(gain * 1.5) : gain;

export const pickDistinctEligibleBonuses = (
  score: number,
  rng: () => number,
  maxCount: number,
): BonusId[] | null => {
  const eligible = getEligible(score).map((bonus) => bonus.id);
  if (eligible.length === 0) return null;
  if (eligible.length <= maxCount) return eligible;

  const pool = [...eligible];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.max(0, Math.min(0.9999999999999999, rng())) * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  return pool.slice(0, Math.max(1, maxCount));
};

const makeSeededRng = (seed: number): (() => number) => {
  let nextSeed = seed >>> 0;
  return () => {
    nextSeed = (nextSeed * 1664525 + 1013904223) >>> 0;
    return nextSeed / 4294967296;
  };
};

export const previewNextDrawValueWithoutConsumingDeck = (
  deck: Deck,
  rngSeed?: number,
): number | null => {
  const previewDeck = { ...deck };
  const rng = typeof rngSeed === "number" ? makeSeededRng(rngSeed) : () => 0;
  const draw = drawFromDeck(previewDeck, rng);
  return draw ? draw.value : null;
};
