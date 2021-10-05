export const clamp = (range: Range, value: number): number =>
  Math.min(Math.max(value, range.min), range.max);

export const contains = (range: Range, value: number): boolean =>
  value >= range.min && value <= range.max;

export type Position = Vector2;

export type Range = { max: number; min: number };

export type Size = Vector2;

type Vector2 = { x: number; y: number };
