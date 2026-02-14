import { GREED_IT_BONUSES, type GreedItBonusId } from "./catalog";

export const randomPickOneGreedItBonus = (rng: () => number): GreedItBonusId => {
  const bounded = Math.max(0, Math.min(0.9999999999999999, rng()));
  const index = Math.floor(bounded * GREED_IT_BONUSES.length);
  return GREED_IT_BONUSES[index].id;
};

export const applyGiPlus5 = (gain: number, giPlus5Active: boolean): number =>
  giPlus5Active ? gain + 5 : gain;
