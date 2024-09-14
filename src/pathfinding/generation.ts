import { Grid } from "./Grid";

class Area {
  constructor(
    public readonly startX: number,
    public readonly startY: number,
    public readonly endX: number,
    public readonly endY: number,
  ) {}

  public get width() {
    return this.endX - this.startX + 1;
  }

  public get height() {
    return this.endY - this.startY + 1;
  }
}

function clamp(val: number, min: number, max: number) {
  if (val < min)
    return min;

  if (val > max)
    return max;

  return val;
}

export function fillMaze(grid: Grid) {
  let root = new Area(0, 0, grid.NumTilesX - 1, grid.NumTilesY - 1);

  let stack = [root];

  while (stack.length > 0) {
    let area = stack.pop()!;

    if (area.width < 4) {
      continue;
    }

    let cutTime = Math.random();

    let cutAtDelta = Math.floor(clamp(area.width * cutTime, 2, area.width - 3));
    let cutAt = area.startX + cutAtDelta;

    let doorTime = Math.random();
    let doorAt = area.startY + Math.floor((area.height - 2) * doorTime);

    for (let y = area.startY, yp = y - 1; y <= area.endY; ++y, ++yp) {
      let node = grid.getNode(cutAt, y);
      if (y === doorAt || yp === doorAt)
        node.walkable = true;
      else
        node.walkable = false;
    }

    let area1 = new Area(
      area.startX, area.startY,
      cutAt - 1, area.endY
    );

    let area2 = new Area(
      cutAt + 1, area.startY,
      area.endX, area.endY
    );

    stack.push(area1, area2);

    // break;
  }
}
