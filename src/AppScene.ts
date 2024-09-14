import Phaser from "phaser";
import { BaseScene } from "./scene/BaseScene";
import { Vector } from "./math/vector";

let tileSize = 26;
let pad = 4;

const COLOR_BLUE = 0x0a78cc;
const COLOR_YELLOW = 0xf2e707;

class Node {
  public gameObject: Phaser.GameObjects.Rectangle;

  constructor(
    public readonly tileX: number,
    public readonly tileY: number,
    public scene: Phaser.Scene,
    public worldX: number,
    public worldY: number,
    public worldSize: number
  ) {
    this.gameObject = scene.add
      .rectangle(worldX, worldY, worldSize, worldSize, COLOR_BLUE)
      .setOrigin(0, 0);
  }

  public setColor(color: number) {
    this.gameObject.setFillStyle(color);
  }
}

export class AppScene extends BaseScene {
  private numTilesX: number;
  private numTilesY: number;

  private worldTopLeft: Vector;
  private gridWorldSize: Vector;

  private nodes: Node[];

  public create() {
    let worldWidth = +this.game.config.width;
    let worldHeight = +this.game.config.height;

    this.gridWorldSize = new Vector(worldWidth, worldHeight);

    this.numTilesX = Math.floor((worldWidth + pad) / (tileSize + pad));
    this.numTilesY = Math.floor((worldHeight + pad) / (tileSize + pad));

    this.worldTopLeft = Vector.zero;

    this.nodes = [];

    for (let y = 0; y < this.numTilesY; ++y) {
      for (let x = 0; x < this.numTilesX; ++x) {
        let worldX = this.worldTopLeft.x + (tileSize + pad) * x;
        let worldY = this.worldTopLeft.y + (tileSize + pad) * y;

        let node = new Node(x, y, this, worldX, worldY, tileSize);
        this.nodes.push(node);
      }
    }
  }

  update() {
    let mousePos = new Vector(this.input.mousePointer.x, this.input.mousePointer.y);
    let hoveredNode = this.worldToGrid(mousePos);

    this.nodes.forEach((node) => {
      let color = node === hoveredNode ? COLOR_YELLOW : COLOR_BLUE;
      node.setColor(color);
    });
  }

  private getNode(tileX: number, tileY: number) {
    let index = tileY * this.numTilesX + tileX;
    return this.nodes[index];
  }

  private worldToGrid(worldPos: Vector) {
    let dx = worldPos.x - this.worldTopLeft.x;
    let dy = worldPos.y - this.worldTopLeft.y;

    let px = dx / (this.gridWorldSize.x);
    let py = dy / (this.gridWorldSize.y);

    let tileX = Math.floor(this.numTilesX * px);
    let tileY = Math.floor(this.numTilesY * py);

    tileX = Phaser.Math.Clamp(tileX, 0, this.numTilesX - 1);
    tileY = Phaser.Math.Clamp(tileY, 0, this.numTilesY - 1);

    return this.getNode(tileX, tileY);
  }
}

export function createGame(canvas: HTMLCanvasElement) {
  let scene = new AppScene();

  let game = new Phaser.Game({
    scene: scene,
    canvas: canvas,
    width: 900,
    height: 600,
    backgroundColor: "#000000",
    type: Phaser.CANVAS,
    powerPreference: "high-performance",
    audio: { noAudio: true },
    banner: false
  });

  return () => {
    scene.destroy();
    game.destroy(false);
  };
}
