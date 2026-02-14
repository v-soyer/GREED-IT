import { GOLD_CATALOG, type GoldId } from "./catalog";

export type GoldDeck = Partial<Record<GoldId, number>>;

const clampRoll = (rng: () => number): number => Math.max(0, Math.min(0.9999999999999999, rng()));

export const createInitialGoldDeck = (rng: () => number, count = 3): GoldDeck => {
  const ids = GOLD_CATALOG.map((item) => item.id);
  const pool = [...ids];

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(clampRoll(rng) * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  const selected = pool.slice(0, Math.min(count, pool.length));
  const deck: GoldDeck = {};
  for (const id of selected) {
    deck[id] = 1;
  }
  return deck;
};

export const takeGoldFromDeck = (goldDeck: GoldDeck, id: GoldId): GoldDeck => {
  const count = goldDeck[id] ?? 0;
  if (count <= 0) return goldDeck;
  return { ...goldDeck, [id]: count - 1 };
};

export const addRandomGoldCards = (
  goldDeck: GoldDeck,
  rng: () => number,
  count: number,
  exclude: GoldId[] = [],
): GoldDeck => {
  const excludeSet = new Set(exclude);
  const pool = GOLD_CATALOG.map((item) => item.id).filter(
    (id) => (goldDeck[id] ?? 0) <= 0 && !excludeSet.has(id),
  );
  if (pool.length === 0 || count <= 0) return goldDeck;

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(clampRoll(rng) * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  const nextDeck = { ...goldDeck };
  for (const id of pool.slice(0, Math.min(count, pool.length))) {
    nextDeck[id] = 1;
  }
  return nextDeck;
};
