import type { AppScene, Node } from "./AppScene";

export abstract class Finder {
  public found = false;
  public ended = false;

  constructor(
    public readonly app: AppScene,
    public readonly nodes: Node[],
    public readonly source: Node,
    public readonly dest: Node
  ) {}

  protected init() {}
  public abstract step(): void;
}

export class BFSFinder extends Finder {
  private queue: Node[];
  public found = false;
  public ended = false;

  override init() {
    this.source.opened = true;
    this.queue = [this.source];
  }

  public step() {
    if (this.queue.length === 0) {
      this.ended = true;
      return;
    }

    let node = this.queue.shift()!;
    node.closed = true;

    if (node === this.dest) {
      this.ended = true;
      this.found = true;
      return;
    }

    for (const ng of this.app.getNeighbours(node)) {
      if (ng.visited) {
        continue;
      }

      ng.opened = true;
      this.queue.push(ng);
    }
  }
}
