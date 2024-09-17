import Phaser, { GameObjects } from "phaser";
import { BaseScene } from "~/scene/BaseScene";
import { Vector } from "~/math/vector";

import {
  BFSFinder,
  AStarFinder,
  DijkstraFinder,
  DFSFinder
} from "./algorithms";
import { Grid } from "./Grid";
import { Node } from "./Node";
// import { fillMaze } from "./rec-subdivide";
import { fillMaze } from "./rec-backtrack";
import { UserPaintMode } from "./UserPaintMode";

const COLOR_LINES = 0x8ed4c7;

const COLOR_UNVISITED = 0xffffff;

const COLOR_WALL = 0x47370c;
const COLOR_HOVER = 0xadd5ff;

const COLOR_SOURCE = 0xace817;
const COLOR_DEST = 0xff885b;

const COLOR_PATH = 0xfffe6a;
const COLOR_OPENED = 0xfcaed9;
const COLOR_CLOSED = 0x815fb3;

const INTERVAL_FIND = 30;
const INTERVAL_TRACE = 10;

enum PaintMode {
  Wall,
  Erase,
  Source,
  Dest
}

export class PathFindingScene extends BaseScene {
  private backSheet: GameObjects.Rectangle;
  private grid: Grid;
  private sourceNode: Node | null = null;
  private destNode: Node | null = null;

  // Paiting
  private mouseDown = false;
  private paintMode = PaintMode.Wall;
  private userPaintMode = UserPaintMode.Wall;

  public create() {
    let grid = (this.grid = new Grid(
      this,
      Vector.zero,
      new Vector(
        //
        +this.game.config.width,
        +this.game.config.height
      )
    ));

    this.backSheet = this.add
      .rectangle(0, 0, grid.OuterWidth, grid.OuterHeight)
      .setOrigin(0, 0)
      .setFillStyle(COLOR_LINES)
      .setDepth(0);

    // fillMaze(this.grid);

    let walkableNodes = grid.getNodes().filter(n => n.walkable);
    walkableNodes.sort(() => 0.5 - Math.random());

    this.sourceNode = walkableNodes[0];
    this.destNode = walkableNodes[1];

    this.input.on("pointerdown", () => {
      this.mouseDown = true;

      let clickedNode = grid.worldToGrid(
        this.input.mousePointer.x,
        this.input.mousePointer.y
      );

      if (clickedNode === this.sourceNode) {
        this.paintMode = PaintMode.Source;
      } else if (clickedNode === this.destNode) {
        this.paintMode = PaintMode.Dest;
      } else if (this.userPaintMode === UserPaintMode.Wall) {
        this.paintMode = PaintMode.Wall;
      } else {
        this.paintMode = PaintMode.Erase;
      }
    });

    this.input.on("pointerup", () => {
      this.mouseDown = false;
    });
  }

  public update() {
    let hoveredNode = this.grid.worldToGrid(
      this.input.mousePointer.x,
      this.input.mousePointer.y
    );

    // prettier-ignore
    if (this.mouseDown) {
      if (this.paintMode === PaintMode.Wall) {
        if (hoveredNode !== this.sourceNode && hoveredNode !== this.destNode)
          hoveredNode.walkable = false;
      }
      else if (this.paintMode === PaintMode.Erase) {
        hoveredNode.walkable = true;
      }
      else if (this.paintMode === PaintMode.Source) {
        if (hoveredNode.walkable)
          this.sourceNode = hoveredNode;
      }
      else if (this.paintMode === PaintMode.Dest) {
        if (hoveredNode.walkable)
          this.destNode = hoveredNode;
      }
    }

    this.grid.getNodes().forEach(node => {
      let color: number;
      if (!node.walkable) {
        color = COLOR_WALL;
      } else if (node === this.sourceNode) {
        color = COLOR_SOURCE;
      } else if (node === this.destNode) {
        color = COLOR_DEST;
      } else if (node.pathNode) {
        color = COLOR_PATH;
      } else if (node.closed) {
        color = COLOR_CLOSED;
      } else if (node.opened) {
        color = COLOR_OPENED;
      } else if (node === hoveredNode) {
        color = COLOR_HOVER;
      } else {
        color = COLOR_UNVISITED;
      }

      node.setColor(color);
    });
  }

  public setUserPaintMode(mode: UserPaintMode) {
    this.userPaintMode = mode;
  }

  public findPath(
    opts: {
      signal?: AbortSignal;
    } = {}
  ): Promise<Node[] | null> {
    return new Promise((resolve, reject) => {
      let { signal } = opts;

      if (signal?.aborted) {
        reject(signal!.reason); // reject
        return;
      }

      this.grid.reset();

      // let finder = new BFSFinder(
      // let finder = new DFSFinder(
      // let finder = new DijkstraFinder(
      let finder = new AStarFinder(
        this.grid,
        this.sourceNode!,
        this.destNode!,
        signal
      );

      finder.init();
      let intervalId: number;

      const stopTask = () => {
        clearInterval(intervalId);
        signal?.removeEventListener("abort", onAbort);
      };

      const onAbort = () => {
        stopTask();
        reject(signal!.reason);
      };

      signal?.addEventListener("abort", onAbort);

      intervalId = setInterval(() => {
        if (signal?.aborted) {
          return;
        }

        finder.progress();

        if (finder.ended) {
          stopTask();
          if (finder.found) {
            resolve(finder.path);
          } else {
            resolve(null);
            // reject(new Error("Path not found")); // reject;
          }
        }
      }, INTERVAL_FIND);
    });
  }

  public tracePath(
    path: Node[],
    opts: { signal?: AbortSignal } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let { signal } = opts;

      if (signal?.aborted) {
        reject(signal!.reason); // reject
        return;
      }

      let nextIndex = 0;
      let intervalId: number;

      const stopTask = () => {
        clearInterval(intervalId);
        signal?.removeEventListener("abort", onAbort);
      };

      const onAbort = () => {
        stopTask();
        reject(signal!.reason); // reject
      };

      signal?.addEventListener("abort", onAbort);

      intervalId = setInterval(() => {
        if (signal?.aborted) {
          return;
        }

        if (nextIndex >= path.length) {
          stopTask();
          resolve();
          return;
        }

        let node = path[nextIndex++];
        node.pathNode = true;
      }, INTERVAL_TRACE);
    });
  }

  public clear() {
    this.grid.reset();
  }

  public reset() {
    // TODO: make beter api
    this.grid.getNodes().forEach(node => {
      node.reset();
      node.walkable = true;
    });
  }

  public override destroy(): void {
    this.backSheet.destroy();
    this.grid.destroy();
  }

  public static createGame(canvas: HTMLCanvasElement) {
    let rect = canvas.getBoundingClientRect();

    const scene = new PathFindingScene();

    const game = new Phaser.Game({
      scene: scene,
      canvas: canvas,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      backgroundColor: "#ffffff",
      type: Phaser.WEBGL,
      // powerPreference: "high-performance",
      audio: { noAudio: true },
      banner: false
    });

    return { scene, game };
  }
}
