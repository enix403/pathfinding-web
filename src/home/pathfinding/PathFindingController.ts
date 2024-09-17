import type { PathFindingScene } from "./PathFindingScene";

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

  public startPathFinding() {
    this.currentAbortController?.abort();

    let controller = new AbortController();
    this.currentAbortController = controller;

    this.runningCount++;

    this.scene
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

  public destroy() {
    this.currentAbortController?.abort();
  }
}
