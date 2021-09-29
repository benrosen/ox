export const clamp = (range: Range, value: number): number =>
  Math.min(Math.max(value, range.min), range.max);

export const contains = (range: Range, value: number): boolean =>
  value >= range.min && value <= range.max;

export type Range = { max: number; min: number };
