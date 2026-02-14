export type BonusId =
  | "PEEK"
  | "DOUBLE_THIS"
  | "SWAN_SONG"
  | "FRIDAY_13"
  | "DECK_SMART"
  | "FLIP_SAFE"
  | "RESET_FORCED"
  | "DOUBLE_DRAW"
  | "ON_Y_CROIT"
  | "FUEGOOO";

export interface BonusDef {
  id: BonusId;
  name: string;
  threshold: number;
  kind: "PASSIVE" | "ACTIVABLE";
  uses?: number;
}

export const BONUS_CATALOG: BonusDef[] = [
  {
    id: "SWAN_SONG",
    name: "Swan Song",
    threshold: 20,
    kind: "PASSIVE",
  },
  {
    id: "PEEK",
    name: "Coup d'oeil",
    threshold: 40,
    kind: "ACTIVABLE",
    uses: 1,
  },
  {
    id: "DECK_SMART",
    name: "Deck Smart",
    threshold: 60,
    kind: "PASSIVE",
  },
  {
    id: "FRIDAY_13",
    name: "Vendredi 13",
    threshold: 100,
    kind: "PASSIVE",
  },
  {
    id: "FLIP_SAFE",
    name: "Flip Safe",
    threshold: 60,
    kind: "ACTIVABLE",
    uses: 1,
  },
  {
    id: "DOUBLE_THIS",
    name: "Double This",
    threshold: 80,
    kind: "ACTIVABLE",
    uses: 1,
  },
  {
    id: "RESET_FORCED",
    name: "Reset Forced",
    threshold: 150,
    kind: "ACTIVABLE",
    uses: 1,
  },
  {
    id: "DOUBLE_DRAW",
    name: "Double Draw",
    threshold: 200,
    kind: "ACTIVABLE",
    uses: 1,
  },
  {
    id: "ON_Y_CROIT",
    name: "On y croit",
    threshold: 250,
    kind: "PASSIVE",
  },
  {
    id: "FUEGOOO",
    name: "Fuegooo",
    threshold: 400,
    kind: "PASSIVE",
  },
];

export const getEligible = (score: number): BonusDef[] =>
  BONUS_CATALOG.filter((bonus) => score >= bonus.threshold);
