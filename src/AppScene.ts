import Phaser from "phaser";
import { BaseScene } from "./scene/BaseScene";
import { Vector } from "./math/vector";

import { BFSFinder, AStarFinder } from "./algorithms";

let tileSize = 26;
let pad = 4;

const COLOR_BLUE = 0x0a78cc;
const COLOR_DIM_BLUE = 0x072942;
const COLOR_YELLOW = 0xf2e707;
const COLOR_RED = 0xeb3a34;
const COLOR_GREEN = 0x37eb34;
const COLOR_CYAN = 0x15edc2;
const COLOR_ORANGE = 0xba7816;

export class Node {
  public gameObject: Phaser.GameObjects.Rectangle;

  public walkable: boolean = true;
  public parent: Node | null = null;

  public pathNode: boolean = false;
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

    this.sourceNode = this.getNode(3, 15);
    this.destNode = this.getNode(25, 2);

    this.input.on("pointerdown", pointer => {
      let mousePos = new Vector(pointer.x, pointer.y);

      let node = this.worldToGrid(mousePos);

      if (node !== this.sourceNode && node !== this.destNode)
        node.walkable = !node.walkable;
    });

    {
      this.input.keyboard?.on("keyup-SPACE", () => {
        this.startFinding();
      });
    }
  }

  public update() {
    let mousePos = new Vector(
      this.input.mousePointer.x,
      this.input.mousePointer.y
    );
    let hoveredNode = this.worldToGrid(mousePos);

    this.nodes.forEach(node => {
      let color: number;
      if (!node.walkable) {
        color = 0x000000;
      } else if (node === this.sourceNode) {
        color = COLOR_GREEN;
      } else if (node === this.destNode) {
        color = COLOR_RED;
      } else if (node.pathNode) {
        color = COLOR_YELLOW;
      } else if (node.closed) {
        color = COLOR_ORANGE;
      } else if (node.opened) {
        color = COLOR_CYAN;
      } else if (node === hoveredNode) {
        color = COLOR_DIM_BLUE;
      } else {
        color = COLOR_BLUE;
      }

      node.setColor(color);
    });
  }

  private startFinding() {
    this.nodes.forEach(n => {
      n.parent = null;

      n.pathNode = false;
      n.closed = false;
      n.opened = false;
    });

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
      finder.step();
      if (finder.ended) {
        clearInterval(intervalId);
        setTimeout(() => {
          this.nodes.forEach(n => {
            n.closed = false;
            n.opened = false;
          });

          if (finder.found) {
            this.startRetrace();
          }
        }, 0);
      }
    }, 10);
  }

  private startRetrace() {
    let path: Node[] = [];
    let current = this.destNode!;

    while (current !== this.sourceNode) {
      path.push(current);
      current = current.parent!;
    }

    path.reverse();
    path.pop(); // Remove destNode;

    let nextIndex = 0;

    let intervalId: number;
    intervalId = setInterval(() => {
      if (nextIndex >= path.length) {
        clearInterval(intervalId);
        return;
      }

      let node = path[nextIndex++];
      node.pathNode = true;
    }, 10);
  }

  public getNode(tileX: number, tileY: number) {
    let index = tileY * this.numTilesX + tileX;
    return this.nodes[index];
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
