import { Vector } from "~/math/vector";
import { Node } from "./Node";
import { GameObjects } from "phaser";

export class Grid {
  private tileSize = 26;
  private pad = 1;

  private numTilesX: number;
  public get NumTilesX() {
    return this.numTilesX;
  }

  private numTilesY: number;
  public get NumTilesY() {
    return this.numTilesY;
  }

  private backSheet: GameObjects.Rectangle;
  private nodes: Node[];

  constructor(
    scene: Phaser.Scene,
    public readonly worldTopLeft: Vector,
    public readonly gridWorldSize: Vector
  ) {
    let outerTileSize = this.tileSize + this.pad;

    this.numTilesX = Math.floor((gridWorldSize.x + this.pad) / outerTileSize);
    this.numTilesY = Math.floor((gridWorldSize.y + this.pad) / outerTileSize);

    // Adjust the tileSize by a little amount so that there is
    // no empty space at the end
    this.tileSize = (gridWorldSize.x + this.pad) / this.numTilesX - this.pad;

    // Do not forget to outerTileSize too
    outerTileSize = this.tileSize + this.pad;

    this.nodes = [];

    for (let y = 0; y < this.numTilesY; ++y) {
      for (let x = 0; x < this.numTilesX; ++x) {
        let worldX = this.worldTopLeft.x + outerTileSize * x;
        let worldY = this.worldTopLeft.y + outerTileSize * y;

        let node = new Node(scene, x, y, worldX, worldY, this.tileSize);
        this.nodes.push(node);
      }
    }
  }

  public reset(keepParents = false) {
    this.nodes.forEach(node => node.reset(keepParents));
  }

  public getNode(tileX: number, tileY: number) {
    let index = tileY * this.numTilesX + tileX;
    return this.nodes[index];
  }

  public getNodes() {
    return this.nodes;
  }

  public getNeighbours(node: Node, includeUnwalkable = false): Node[] {
    let neighbours: Node[] = [];

    // prettier-ignore
    const dirs = [
      { x:  0, y:  1 },
      { x:  0, y: -1 },
      { x:  1, y:  0 },
      { x: -1, y:  0 },
    ];

    for (const { x, y } of dirs) {
      let tileX = node.tileX + x;
      let tileY = node.tileY + y;

      if (
        tileX >= 0 &&
        tileX < this.numTilesX &&
        tileY >= 0 &&
        tileY < this.numTilesY
      ) {
        if (includeUnwalkable || node.walkable)
          neighbours.push(this.getNode(tileX, tileY));
      }
    }

    return neighbours;
  }

  public worldToGrid(worldX: number, worldY: number) {
    let dx = worldX - this.worldTopLeft.x;
    let dy = worldY - this.worldTopLeft.y;

    let px = dx / this.gridWorldSize.x;
    let py = dy / this.gridWorldSize.y;

    let tileX = Math.floor(this.numTilesX * px);
    let tileY = Math.floor(this.numTilesY * py);

    tileX = Phaser.Math.Clamp(tileX, 0, this.numTilesX - 1);
    tileY = Phaser.Math.Clamp(tileY, 0, this.numTilesY - 1);

    return this.getNode(tileX, tileY);
  }

  public isValid(tileX: number, tileY: number) {
    return (
      tileX >= 0 &&
      tileX < this.numTilesX &&
      tileY >= 0 &&
      tileY < this.numTilesY
    );
  }
}
