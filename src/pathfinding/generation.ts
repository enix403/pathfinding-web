import { Grid } from "./Grid";

function clamp(val: number, min: number, max: number) {
  if (val < min) return min;

  if (val > max) return max;

  return val;
}

class Area {
  constructor(
    public readonly startX: number,
    public readonly startY: number,
    public readonly width: number,
    public readonly height: number,
    public readonly lastCutOrient: "h" | "v",
    public readonly lastCutAt: number
  ) {}
}

function divideV(grid: Grid, area: Area, stack: Area[]) {
  if (area.width <= 4) {
    return;
  }

  let cutAt = area.startX + 1 + Math.floor((area.width - 2) * Math.random());
  let doorAt = Math.floor(area.height * Math.random());

  for (let y = 1; y < area.height - 1; ++y) {
    let node = grid.getNode(cutAt, area.startY + y);
    if (y === doorAt) node.walkable = true;
    else node.walkable = false;
  }

  let area1 = new Area(
    area.startX,
    area.startY,
    cutAt - area.startX,
    area.height,
    "v",
    cutAt
  );

  let area2 = new Area(
    cutAt + 1,
    area.startY,
    area.startX + area.width - cutAt - 1,
    area.height,
    "v",
    cutAt
  );

  stack.push(area1);
  stack.push(area2);
}

export function fillMaze(grid: Grid) {
  let root = new Area(0, 0, grid.NumTilesX, grid.NumTilesY, "v", -1);

  let stack = [root];

  while (stack.length > 0) {
    let area = stack.pop()!;

    divideV(grid, area, stack);
  }
}
