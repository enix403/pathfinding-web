import Phaser, { GameObjects, Scene } from "phaser";
import { Vector } from "~/math/vector";

import type { FinderClass } from "./algorithms";
import { Grid } from "./Grid";
import { Node } from "./Node";
// import { fillMaze } from "./rec-subdivide";
import { fillMaze } from "./rec-backtrack";
import { UserPaintMode } from "./UserPaintMode";
import { PathRequest } from "./PathRequest";
import { MazeGenerator } from "./mazegen/MazeGenerator";

const COLOR_LINES = 0x8ed4c7;

const COLOR_UNVISITED = 0xffffff;

const COLOR_WALL = 0x0c1747;
const COLOR_HOVER = 0xadd5ff;

const COLOR_SOURCE = 0xace817;
const COLOR_DEST = 0xff885b;

const COLOR_PATH = 0xfffe6a;
const COLOR_OPENED = 0xfcaed9;
const COLOR_CLOSED = 0x815fb3;

enum PaintMode {
  Wall,
  Erase,
  Source,
  Dest
}

export class PathFindingScene extends Scene implements PathRequest {
  private backSheet: GameObjects.Rectangle;
  private grid: Grid;
  private sourceNode: Node | null = null;
  private destNode: Node | null = null;

  // Paiting
  private mouseDown = false;
  private paintMode = PaintMode.Wall;
  private userPaintMode = UserPaintMode.Wall;

  private runningCount: number = 0;

  public get IsRunning() {
    return this.runningCount !== 0;
  }

  public getSource(): Node {
    return this.sourceNode!;
  }

  public getDest(): Node {
    return this.destNode!;
  }

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

    let walkableNodes = [...grid.getNodes()];
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
      else if (this.paintMode === PaintMode.Source && !this.IsRunning) {
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

  public generateMaze(mazeGen: MazeGenerator) {
    if (this.IsRunning) {
      return;
    }

    this.reset();
    mazeGen.generate(this.grid);

    let changeSource = !this.sourceNode?.walkable;
    let changeDest = !this.destNode?.walkable;

    if (changeSource || changeDest) {
      let walkableNodes = this.grid.getNodes().filter(node => node.walkable);
      walkableNodes.sort(() => 0.5 - Math.random());

      let i = 0;

      if (changeSource) {
        this.sourceNode = walkableNodes[i++] || this.grid.getNode(0, 0);
        this.sourceNode.walkable = true;
      }

      if (changeDest) {
        this.destNode = walkableNodes[i++] || this.grid.getNode(0, 1);
        this.destNode.walkable = true;
      }
    }
  }

  public async findPath(
    finderClass: FinderClass,
    opts: {
      stepInterval?: number;
      signal?: AbortSignal;
    } = {}
  ): Promise<Node[] | null> {
    this.runningCount++;
    try {
      let path = await this.findPathInner(finderClass, opts);
      return path;
    } finally {
      this.runningCount--;
    }
  }

  private findPathInner(
    finderClass: FinderClass,
    opts: {
      stepInterval?: number;
      signal?: AbortSignal;
    } = {}
  ): Promise<Node[] | null> {
    return new Promise((resolve, reject) => {
      let { signal, stepInterval } = opts;

      if (signal?.aborted) {
        reject(signal!.reason); // reject
        return;
      }

      this.grid.reset();

      let finder = new finderClass(this.grid, this, signal);

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
      }, stepInterval ?? 30);
    });
  }

  public tracePath(
    path: Node[],
    opts: {
      stepInterval?: number;
      signal?: AbortSignal;
    } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let { signal, stepInterval } = opts;

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
      }, stepInterval ?? 10);
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

  public destroy(): void {
    this.backSheet?.destroy();
    this.grid?.destroy();
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
