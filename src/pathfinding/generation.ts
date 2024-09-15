import { Grid } from "./Grid";

function randrange(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function subdivide(
  grid: Grid,
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  isHorizontal: boolean // If this next cut should be horizontal or not.
) {
  let width = endX - startX + 1;
  let height = endY - startY + 1;

  if (isHorizontal) {
    if (height <= 2) {
      return;
    }

    let wallY = Math.floor(randrange(startY, endY) / 2) * 2;
    let holeX = Math.floor(randrange(startX, endX) / 2) * 2 + 1;

    for (var x = startX; x <= endX; ++x) {
      if (x !== holeX) {
        let node = grid.getNode(x, wallY);
        node.walkable = false;
      }
    }

    subdivide(grid, startX, endX, startY, wallY - 1, false);
    subdivide(grid, startX, endX, wallY + 1, endY, false);
  } else {
    // Vertical cut
    if (width <= 2) {
      return;
    }

    let wallX = Math.floor(randrange(startX, endX) / 2) * 2;
    let holeY = Math.floor(randrange(startY, endY) / 2) * 2 + 1;

    for (var y = startY; y <= endY; ++y) {
      if (y !== holeY) {
        let node = grid.getNode(wallX, y);
        node.walkable = false;
      }
    }

    subdivide(grid, startX, wallX - 1, startY, endY, true);
    subdivide(grid, wallX + 1, endX, startY, endY, true);
  }
}

function wrapOuterWalls(grid: Grid, width: number, height: number) {
  for (let x = 0; x < width; ++x) {
    let nodeTop = grid.getNode(x, 0);
    let nodeBottom = grid.getNode(x, height - 1);

    nodeTop.walkable = false;
    nodeBottom.walkable = false;
  }

  for (let y = 0; y < height; ++y) {
    let nodeLeft = grid.getNode(0, y);
    let nodeRight = grid.getNode(width - 1, y);

    nodeLeft.walkable = false;
    nodeRight.walkable = false;
  }
}

export function fillMaze(grid: Grid) {

  let width = grid.NumTilesX;
  let height = grid.NumTilesY;

  if (width % 2) width--;

  if (height % 2) height--;

  wrapOuterWalls(grid, width, height);
  subdivide(grid, 1, width - 2, 1, height - 2, false);
}
