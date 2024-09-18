import { Vector } from "~/math/vector";

export const Directions = {
  Up: new Vector(0, -1),
  Down: new Vector(0, 1),
  Left: new Vector(-1, 0),
  Right: new Vector(1, 0)
} as const;
