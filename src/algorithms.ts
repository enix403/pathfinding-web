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

/* ==================== */

export class AStarFinder extends Finder {
  private openList: Node[];

  public init() {
    this.source.opened = true;
    this.openList = [this.source];

    this.source.gCost = 0;
    this.source.hCost = this.getDistance(this.source, this.dest);
  }

  public step(): void {
    if (this.openList.length === 0) {
      this.ended = true;
      return;
    }

    let minFCostNode = this.nodes[0];
    let minIndex = 0;
    for (let i = 1; i < this.nodes.length; ++i) {
      let node = this.nodes[i];
      if (node.fCost < minFCostNode.fCost) {
        minFCostNode = node;
        minIndex = i;
      }
    }

    let node: Node;
    {
      let removed = this.openList.splice(minIndex, 1);
      node = removed[0];
    }

    node.closed = true;

    if (node === this.dest) {
      this.ended = true;
      this.found = true;
      return;
    }

    for (const ng of this.app.getNeighbours(node)) {
      if (ng.closed) {
        continue;
      }

      let costToNeighbour = this.getDistance(node, ng);
      let neighbourGCost = node.gCost + costToNeighbour;

      if (!ng.opened || neighbourGCost < ng.gCost) {
        if (!ng.opened) {
          this.openList.push(ng);
        }

        ng.opened = true;
        ng.gCost = neighbourGCost;
        ng.hCost = this.getDistance(ng, this.dest);
      }
    }
  }

  private getDistance(nodeA: Node, nodeB: Node) {
    let dx = Math.abs(nodeA.tileX - nodeB.tileX);
    let dy = Math.abs(nodeA.tileY - nodeB.tileY);

    let short = Math.min(dx, dy);
    let long = Math.max(dx, dy);

    return 14 * short + 10 * (long - short);
  }
}
