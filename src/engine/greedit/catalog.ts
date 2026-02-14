export type GreedItBonusId =
  | "GI_PLUS_5"
  | "GI_SCORE_SAVED"
  | "GI_TRIPLE_BONUS"
  | "GI_GOLD_PLUS"
  | "GI_TRIPLE_STREAK";

export interface GreedItBonusDef {
  id: GreedItBonusId;
  name: string;
}

export const GREED_IT_BONUSES: GreedItBonusDef[] = [
  { id: "GI_PLUS_5", name: "GI Plus 5" },
  { id: "GI_SCORE_SAVED", name: "GI Score Saved" },
  { id: "GI_TRIPLE_BONUS", name: "GI Triple Bonus" },
  { id: "GI_GOLD_PLUS", name: "GI Gold Plus" },
  { id: "GI_TRIPLE_STREAK", name: "GI Triple Streak" },
];
