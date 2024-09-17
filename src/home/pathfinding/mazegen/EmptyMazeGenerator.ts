import { MazeGenerator } from "./MazeGenerator";
import type { Grid } from "../Grid";

export class EmptyMazeGenerator implements MazeGenerator {
  public generate(_grid: Grid) {
    /* ... nothing ... */
  }
}
