import Phaser from "phaser";
import { BaseScene } from "~/scene/BaseScene";
import { Vector } from "~/math/vector";

import { BFSFinder, AStarFinder } from "./algorithms";
import { Grid } from "./Grid";
import { Node } from "./Node";

export const COLOR_BLUE = 0x0a78cc;
export const COLOR_DIM_BLUE = 0x072942;
export const COLOR_YELLOW = 0xf2e707;
export const COLOR_RED = 0xeb3a34;
export const COLOR_GREEN = 0x37eb34;
export const COLOR_CYAN = 0x15edc2;
export const COLOR_ORANGE = 0xba7816;

export class PathFindingScene extends BaseScene {
  private grid: Grid;
  private sourceNode: Node | null = null;
  private destNode: Node | null = null;

  public create() {
    this.grid = new Grid(
      this,
      Vector.zero,
      new Vector(
        //
        +this.game.config.width,
        +this.game.config.height
      )
    );

    this.sourceNode = this.grid.getNode(3, 15);
    this.destNode = this.grid.getNode(25, 2);

    this.input.on("pointerdown", pointer => {
      let node = this.grid.worldToGrid(pointer.x, pointer.y);

      if (node !== this.sourceNode && node !== this.destNode)
        node.walkable = !node.walkable;
    });

    this.input.keyboard?.on("keyup-SPACE", () => {
      this.findPath().then(path => {
        return path && this.tracePath(path);
      });
    });
  }

  public update() {
    let hoveredNode = this.grid.worldToGrid(
      this.input.mousePointer.x,
      this.input.mousePointer.y
    );

    this.grid.getNodes().forEach(node => {
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

  private findPath(): Promise<Node[] | null> {
    this.grid.reset();

    // let finder = new BFSFinder(
    let finder = new AStarFinder(this.grid, this.sourceNode!, this.destNode!);

    finder.init();

    return new Promise(resolve => {
      let intervalId: number;
      intervalId = setInterval(() => {
        finder.step();
        if (finder.ended) {
          clearInterval(intervalId);
          setTimeout(() => {
            this.grid.reset(true);

            if (finder.found) {
              resolve(finder.path);
            } else {
              resolve(null);
            }
          }, 0);
        }
      }, 30);
    });
  }

  private tracePath(path: Node[]): Promise<void> {
    return new Promise(resolve => {
      let nextIndex = 0;
      let intervalId: number;
      intervalId = setInterval(() => {
        if (nextIndex >= path.length) {
          clearInterval(intervalId);
          resolve();
          return;
        }

        let node = path[nextIndex++];
        node.pathNode = true;
      }, 10);
    });
  }
}

export function createGame(canvas: HTMLCanvasElement) {
  let scene = new PathFindingScene();

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
