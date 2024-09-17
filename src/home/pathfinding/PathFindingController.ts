import type { PathFindingScene } from "./PathFindingScene";
import { UserPaintMode } from "./UserPaintMode";

export class PathFindingController {
  private currentAbortController: AbortController | null;

  private runningCount: number;

  public get IsRunning() {
    return this.runningCount === 0;
  }

  constructor(private readonly scene: PathFindingScene) {
    this.currentAbortController = null;
    this.runningCount = 0;
  }

  public async startPathFinding() {
    this.currentAbortController?.abort();

    let controller = new AbortController();
    this.currentAbortController = controller;

    this.runningCount++;

    await this.scene
      .findPath({ signal: controller.signal })
      .then(path => {
        if (path) {
          return this.scene.tracePath(path, { signal: controller.signal });
        }
      })
      .then(() => {
        console.log("Ended");
      })
      .catch(err => {
        if (err.name === "AbortError") {
          // Aborted
        }
      }).finally(() => {
        this.runningCount--;
      });
  }

  public stop() {
    this.currentAbortController?.abort();
  }

  public clear() {
    this.scene.clear();
  }

  public reset() {
    this.scene.reset();
  }

  public setUserPaintMode(mode: UserPaintMode) {
    this.scene.setUserPaintMode(mode);
  }

  public destroy() {
    this.currentAbortController?.abort();
  }
}
