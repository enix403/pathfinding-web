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
    this.source.parent = null;
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
      ng.parent = node;
    }
  }
}

/* ==================== */

export class AStarFinder extends Finder {
  public openList: Node[];

  public init() {
    this.source.opened = true;
    this.source.parent = null;
    this.openList = [this.source];

    this.source.gCost = 0;
    this.source.hCost = this.getDistance(this.source, this.dest);
  }

  public step(): void {
    if (this.openList.length === 0) {
      this.ended = true;
      return;
    }

    let minFCostNode = this.openList[0];
    let minIndex = 0;
    for (let i = 1; i < this.openList.length; ++i) {
      let node = this.openList[i];
      if (
        node.fCost < minFCostNode.fCost
        || (node.fCost === minFCostNode.fCost && node.hCost < minFCostNode.hCost)
      ) {
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
        ng.parent = node;
      }
    }
  }

  private getDistance(nodeA: Node, nodeB: Node) {
    let dx = Math.abs(nodeA.tileX - nodeB.tileX);
    let dy = Math.abs(nodeA.tileY - nodeB.tileY);

    return dx + dy;
  }
}
