import { FinderClass } from "./algorithms";
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

  public async startPathFinding(finderClass: FinderClass) {
    this.currentAbortController?.abort();

    let controller = new AbortController();
    this.currentAbortController = controller;

    await this.scene
      .findPath(finderClass, { signal: controller.signal })
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
