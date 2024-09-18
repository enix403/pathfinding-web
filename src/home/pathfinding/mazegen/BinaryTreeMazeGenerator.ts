import { Vector } from "~/math/vector";
import { Grid } from "../Grid";
import { MazeGenerator } from "./MazeGenerator";
import { Directions } from "../Directions";

export class BinaryTreeMazeGenerator implements MazeGenerator {
  generate(grid: Grid) {
    let evenWidth = Math.floor(grid.NumTilesX / 2) * 2;
    let evenHeight = Math.floor(grid.NumTilesY / 2) * 2;

    grid.getNodes().forEach(node => {
      node.walkable = false;
    });

    for (let y = 0; y < evenHeight; y += 2) {
      for (let x = 0; x < evenWidth; x += 2) {
        let node = grid.getNode(x, y);
        node.walkable = true;

        let dirs: Vector[] = [];
        // up or left

        if (node.tileX > 0) dirs.push(Directions.Left);

        if (node.tileY > 0) dirs.push(Directions.Up);

        if (dirs.length === 0) continue;

        let dir = dirs[Math.floor(Math.random() * dirs.length)];

        let wx = node.tileX + dir.x;
        let wy = node.tileY + dir.y;

        let nx = node.tileX + 2 * dir.x;
        let ny = node.tileY + 2 * dir.y;

        let wall = grid.getNode(wx, wy);
        let ng = grid.getNode(nx, ny);

        wall.walkable = true;
        ng.walkable = true;
      }
    }
  }
}
