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
  if (area.width <= 2) {
    return;
  }

  let cutAt = area.startX + 1 + Math.floor((area.width - 2) * Math.random());
  let doorAt = Math.floor(area.height * Math.random());

  for (let y = 0; y < area.height; ++y) {
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

function divideH(grid: Grid, area: Area, stack: Area[]) {
  if (area.height <= 2) {
    return;
  }

  let cutAt = area.startY + 1 + Math.floor((area.height - 2) * Math.random());
  let doorAt = Math.floor(area.width * Math.random());

  for (let x = 0; x < area.width; ++x) {
    let node = grid.getNode(area.startX + x, cutAt);
    if (x === doorAt) node.walkable = true;
    else node.walkable = false;
  }

  let area1 = new Area(
    area.startX, area.startY,
    area.width, cutAt - area.startY,
    "v", cutAt
  );

  let area2 = new Area(
    area.startX, cutAt + 1,
    area.width, area.startY + area.height - cutAt - 1,
    "v", cutAt
  );

  stack.push(area1);
  stack.push(area2);
}


export function fillMaze(grid: Grid) {
  let root = new Area(0, 0, grid.NumTilesX, grid.NumTilesY, "v", -1);

  let stack = [root];

  while (stack.length > 0) {
    let area = stack.pop()!;

    if (area.width > area.height)
      divideV(grid, area, stack);
    else
      divideH(grid, area, stack);
  }
}
