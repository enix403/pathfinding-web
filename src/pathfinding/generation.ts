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
    public readonly lastDoorAt: number
  ) {}
}

function divideV(grid: Grid, area: Area, stack: Area[]) {
  if (area.width <= 3) {
    return;
  }

  let cutAt = area.startX + 1 + Math.floor((area.width - 2) * Math.random());

  if (area.lastCutOrient === 'h') {
    if (area.lastDoorAt === cutAt) {
      return;
    }
  }

  let doorAt = Math.floor(area.height * Math.random());

  for (let y = 0; y < area.height; ++y) {
    let node = grid.getNode(cutAt, area.startY + y);
    if (y === doorAt) node.walkable = true;
    else node.walkable = false;
  }

  doorAt += area.startY;

  let area1 = new Area(
    area.startX,
    area.startY,
    cutAt - area.startX,
    area.height,
    "v",
    doorAt
  );

  let area2 = new Area(
    cutAt + 1,
    area.startY,
    area.startX + area.width - cutAt - 1,
    area.height,
    "v",
    doorAt
  );

  stack.push(area1);
  stack.push(area2);
}

function divideH(grid: Grid, area: Area, stack: Area[]) {
  if (area.height <= 3) {
    return;
  }

  let cutAt = area.startY + 1 + Math.floor((area.height - 2) * Math.random());
  let doorAt = Math.floor(area.width * Math.random());

  if (area.lastCutOrient === 'v') {
    if (area.lastDoorAt === cutAt) {
      return;
    }
  }

  for (let x = 0; x < area.width; ++x) {
    let node = grid.getNode(area.startX + x, cutAt);
    if (x === doorAt) node.walkable = true;
    else node.walkable = false;
  }

  doorAt += area.startX;

  let area1 = new Area(
    area.startX,
    area.startY,
    area.width,
    cutAt - area.startY,
    "h",
    doorAt
  );

  let area2 = new Area(
    area.startX,
    cutAt + 1,
    area.width,
    area.startY + area.height - cutAt - 1,
    "h",
    doorAt
  );

  stack.push(area1);
  stack.push(area2);
}

export function fillMaze(grid: Grid) {
  let root = new Area(0, 0, grid.NumTilesX, grid.NumTilesY, "v", -1);

  let stack = [root];

  while (stack.length > 0) {
    let area = stack.pop()!;

    if (area.width > area.height) divideV(grid, area, stack);
    else divideH(grid, area, stack);
  }
}
