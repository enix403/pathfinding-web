import type { Grid } from '../Grid';

export interface MazeGenerator {
  generate(grid: Grid);
}
