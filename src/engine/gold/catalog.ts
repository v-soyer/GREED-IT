export type GoldId =
  | "GOLD_PLUS_15"
  | "GOLD_MINUS_15"
  | "GOLD_BENCH_GOLDEN"
  | "GOLD_ECHO"
  | "GOLD_RESET"
  | "GOLD_PRECISION"
  | "GOLD_SHIELD"
  | "GOLD_CONTROL"
  | "GOLD_LAST_X2"
  | "GOLD_CHAIN"
  | "GOLD_THRESHOLD"
  | "GOLD_GREED_SERENE"
  | "GOLD_BET"
  | "GOLD_KEK"
  | "GOLD_GREED_IT"
  | "GOLD_GOLD_AND_SILVER"
  | "GOLD_STREAK_GOLDEN"
  | "GOLD_DESTINY"
  | "GOLD_ITS_ME_GREED";

export interface GoldDef {
  id: GoldId;
  name: string;
}

export const GOLD_CATALOG: GoldDef[] = [
  { id: "GOLD_PLUS_15", name: "Plus 15" },
  { id: "GOLD_MINUS_15", name: "Minus 15" },
  { id: "GOLD_BENCH_GOLDEN", name: "Bench Golden" },
  { id: "GOLD_ECHO", name: "Echo" },
  { id: "GOLD_RESET", name: "Reset" },
  { id: "GOLD_PRECISION", name: "Precision" },
  { id: "GOLD_SHIELD", name: "Shield" },
  { id: "GOLD_CONTROL", name: "Control" },
  { id: "GOLD_LAST_X2", name: "Last X2" },
  { id: "GOLD_CHAIN", name: "Chain" },
  { id: "GOLD_THRESHOLD", name: "Threshold" },
  { id: "GOLD_GREED_SERENE", name: "Greed Serene" },
  { id: "GOLD_BET", name: "Bet" },
  { id: "GOLD_KEK", name: "Kek" },
  { id: "GOLD_GREED_IT", name: "Greed It" },
  { id: "GOLD_GOLD_AND_SILVER", name: "Gold and Silver" },
  { id: "GOLD_STREAK_GOLDEN", name: "Streak Golden" },
  { id: "GOLD_DESTINY", name: "Destiny" },
  { id: "GOLD_ITS_ME_GREED", name: "It's Me Greed" },
];
