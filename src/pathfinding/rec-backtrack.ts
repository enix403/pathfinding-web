import { Grid } from "./Grid";

function carvePassage(grid: Grid, cx: number, cy: number) {
  let dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

  dirs.sort(() => 0.5 - Math.random());

  let node = grid.getNode(cx, cy);
  node.closed = true;

  for (const { x, y } of dirs) {
    let wx = cx + x;
    let wy = cy + y;

    let nx = cx + 2 * x;
    let ny = cy + 2 * y;

    if (!grid.isValid(nx, ny)) {
      continue;
    }

    let ng = grid.getNode(nx, ny);
    let wall = grid.getNode(wx, wy);

    if (ng.closed) {
      continue;
    }

    wall.walkable = true;
    ng.walkable = true;

    carvePassage(grid, nx, ny);
  }
}

export function fillMaze(grid: Grid) {
  grid.getNodes().forEach(node => {
    node.walkable = false;
  });

  grid.getNode(0, 0).walkable = true;

  carvePassage(grid, 0, 0);

  grid.getNodes().forEach(node => {
    node.closed = false;
  });
}
