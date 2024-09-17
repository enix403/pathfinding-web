import { FinderClass } from "./algorithms";
import { MazeGenerator } from "./mazegen/MazeGenerator";
import type { PathFindingScene } from "./PathFindingScene";
import { UserPaintMode } from "./UserPaintMode";

export class PathFindingController {
  private currentAbortController: AbortController | null;

  public get IsRunning() {
    // return this.runningCount === 0;
    return this.scene.IsRunning;
  }

  constructor(private readonly scene: PathFindingScene) {
    this.currentAbortController = null;
  }

  public async startPathFinding(
    finderClass: FinderClass,
    stepInterval: number = 30
  ) {
    this.currentAbortController?.abort();

    let controller = new AbortController();
    this.currentAbortController = controller;

    let traceStepInterval = Math.round(stepInterval * 0.5);

    await this.scene
      .findPath(finderClass, { stepInterval, signal: controller.signal })
      .then(path => {
        if (path) {
          return this.scene.tracePath(path, {
            stepInterval: traceStepInterval,
            signal: controller.signal
          });
        }
      })
      .then(() => {
        console.log("Ended");
      })
      .catch(err => {
        if (err.name === "AbortError") {
          // Aborted
        }
      });
  }

  public stop() {
    this.currentAbortController?.abort();
  }

  public clear() {
    this.currentAbortController?.abort();
    this.scene.clear();
  }

  public reset() {
    this.currentAbortController?.abort();
    this.scene.reset();
  }

  public setUserPaintMode(mode: UserPaintMode) {
    this.scene.setUserPaintMode(mode);
  }

  public generateMaze(mazeGen: MazeGenerator) {
    this.scene.generateMaze(mazeGen);
  }

  public destroy() {
    this.currentAbortController?.abort();
  }
}
