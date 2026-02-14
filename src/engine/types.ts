import type { BonusId } from "./bonus/catalog";
import type { GreedItBonusId } from "./greedit/catalog";
import type { GoldId } from "./gold/catalog";
import type { GoldDeck } from "./gold/goldDeck";

export type RunStatus = "IDLE" | "RUNNING" | "WON" | "LOST";

export type Deck = Record<number, number>;

export interface GameState {
  bestScore: number;
  previousRunScore: number;
  pendingBonuses: BonusId[];
  pendingGreedItBonus: GreedItBonusId | null;
  streak: number;
  runStatus: RunStatus;
  score: number;
  bench: number[];
  benchOnFire: boolean;
  discardUsesLeft: number;
  deck: Deck;
  flipCount: number;
  selfOvertakeTriggered: boolean;
  benchCompleteTriggered: boolean;
  bonusOffer: BonusId[] | null;
  bonusChoiceLocked: boolean;
  activeBonuses: {
    peekUsesLeft: number;
    doubleUsesLeft: number;
    doubleNextFlipArmed: boolean;
    swanShieldAvailable: boolean;
    deckSmartEnabled: boolean;
    flipSafeUsesLeft: number;
    flipSafeArmed: boolean;
    resetForcedUsesLeft: number;
    friday13Available: boolean;
    onycActive: boolean;
    doubleDrawUsesLeft: number;
    fuegoooEnabled: boolean;
    precisionArmed: boolean;
    goldShieldAvailable: boolean;
  };
  nextCardPreview: number | null;
  goldCap: number;
  goldDrawnCount: number;
  goldDrawnIds: GoldId[];
  goldDeck: GoldDeck;
  lastNormalValue: number | null;
  chainPending: boolean;
  pariPendingFlip: boolean;
  lastFlipKind: "GOLD" | "NORMAL_OK" | "DUP_IGNORED" | "LOST" | null;
  greedItOverride: boolean;
  streakMultiplier: number;
  destinyFlipsLeft: number;
  greedItOffered: boolean;
  greedItResolved: boolean;
  giPlus5Active: boolean;
  giTripleBonusActive: boolean;
  giGoldPlusActive: boolean;
  rngSeed?: number;
}

export type StartRunAction = { type: "START_RUN" };
export type FlipAction = { type: "FLIP" };
export type StopAction = { type: "STOP" };
export type DiscardAction = { type: "DISCARD"; payload: { value: number } };
export type ResetBenchAction = { type: "RESET_BENCH" };
export type ChooseBonusesAction = { type: "CHOOSE_BONUSES"; payload: { selected: BonusId[] } };
export type UseBonusAction = { type: "USE_BONUS"; payload: { id: BonusId } };
export type AcceptGreedItAction = { type: "ACCEPT_GREED_IT" };
export type DeclineGreedItAction = { type: "DECLINE_GREED_IT" };

export type GameAction =
  | StartRunAction
  | FlipAction
  | StopAction
  | DiscardAction
  | ResetBenchAction
  | ChooseBonusesAction
  | UseBonusAction
  | AcceptGreedItAction
  | DeclineGreedItAction;
