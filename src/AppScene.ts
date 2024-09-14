import Phaser from "phaser";
import { BaseScene } from "./scene/BaseScene";
import { Vector } from "./math/vector";

import { BFSFinder, AStarFinder } from "./algorithms";

let tileSize = 26;
let pad = 4;

const COLOR_BLUE = 0x0a78cc;
const COLOR_YELLOW = 0xf2e707;
const COLOR_RED = 0xeb3a34;
const COLOR_GREEN = 0x37eb34;
const COLOR_CYAN = 0x15edc2;
const COLOR_ORANGE = 0xba7816;

export class Node {
  public gameObject: Phaser.GameObjects.Rectangle;

  public opened: boolean = false;
  public closed: boolean = false;

  public get visited() {
    return this.opened || this.closed;
  }

  // For A* algorithm
  public gCost = 0;
  public hCost = 0;

  public get fCost() {
    return this.gCost + this.hCost;
  }

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
  private sourceNode: Node | null = null;
  private destNode: Node | null = null;

  // private finder: BFSFinder | null = null;

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

    this.initFinder();
  }

  public update() {
    // let mousePos = new Vector(
    //   this.input.mousePointer.x,
    //   this.input.mousePointer.y
    // );
    // let hoveredNode = this.worldToGrid(mousePos);

    this.nodes.forEach(node => {
      let color: number;
      if (node === this.sourceNode) {
        color = COLOR_GREEN;
      } else if (node === this.destNode) {
        color = COLOR_RED;
      } else if (node.closed) {
        color = COLOR_ORANGE;
      } else if (node.opened) {
        color = COLOR_CYAN;
        // } else if (node === hoveredNode) {
        // color = COLOR_YELLOW;
      } else {
        color = COLOR_BLUE;
      }

      node.setColor(color);
    });
  }

  private initFinder() {
    this.sourceNode = this.getNode(3, 15);
    this.destNode = this.getNode(25, 2);

    // this.sourceNode = this.getNode(3, 15);
    // this.destNode = this.getNode(8, 15);

    // let finder = new BFSFinder(
    let finder = new AStarFinder(
      this,
      this.nodes,
      this.sourceNode!,
      this.destNode!
    );

    finder.init();

    let intervalId: number;

    intervalId = setInterval(() => {
      finder?.step();
      if (finder?.ended) {
        clearInterval(intervalId);
      }
    }, 50);

    /* {
      console.log(finder.openList);
      // @ts-ignore
      window.f = finder;
      this.input.keyboard?.on("keyup-SPACE", () => {
        finder?.step();
        console.log(finder.openList);
      });
    } */
  }

  public getNode(tileX: number, tileY: number) {
    let index = tileY * this.numTilesX + tileX;
    return this.nodes[index];
  }

  public getNeighbours(node: Node): Node[] {
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
        neighbours.push(this.getNode(tileX, tileY));
      }
    }

    return neighbours;
  }

  public worldToGrid(worldPos: Vector) {
    let dx = worldPos.x - this.worldTopLeft.x;
    let dy = worldPos.y - this.worldTopLeft.y;

    let px = dx / this.gridWorldSize.x;
    let py = dy / this.gridWorldSize.y;

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
    backgroundColor: "#222124",
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
