import { Grid } from "./Grid";
import { Node } from "./Node";

export abstract class Finder {
  protected _found = false;
  public get found() { return this._found; }

  protected _ended = false;
  public get ended() { return this._ended; }

  // Does not contain source node.
  // Contains destination node.
  protected _path: Node[] = [];
  public get path() { return this._path; }

  constructor(
    public readonly grid: Grid,
    public readonly source: Node,
    public readonly dest: Node
  ) {}

  protected init() {}
  public abstract step(): void;

  protected constructPath() {
    this._ended = true;
    this._found = true;

    let path: Node[] = [];
    let current = this.dest!;

    while (current !== this.source) {
      path.push(current);
      current = current.parent!;
    }

    path.reverse();

    this._path = path;
  }
}

export class BFSFinder extends Finder {
  private queue: Node[];

  override init() {
    this.source.opened = true;
    this.source.parent = null;
    this.queue = [this.source];
  }

  public step() {
    if (this.queue.length === 0) {
      this._ended = true;
      return;
    }

    let node = this.queue.shift()!;
    node.closed = true;

    if (node === this.dest) {
      this.constructPath();
      return;
    }

    for (const ng of this.grid.getNeighbours(node)) {
      if (ng.opened || ng.closed) {
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

  private _gCosts: Map<Node, number>;
  private _hCosts: Map<Node, number>;

  public init() {
    this._gCosts = new Map();
    this._hCosts = new Map();

    let { source } = this;

    source.opened = true;
    source.parent = null;

    this.openList = [source];

    this.setGCost(source, 0);
  }

  public step(): void {
    if (this.openList.length === 0) {
      this._ended = true;
      return;
    }

    let minFCostNode = this.openList[0];
    let minIndex = 0;
    for (let i = 1; i < this.openList.length; ++i) {
      let node = this.openList[i];
      if (
        this.fCost(node) < this.fCost(minFCostNode) ||
        (this.fCost(node) === this.fCost(minFCostNode) &&
          this.hCost(node) < this.hCost(minFCostNode))
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
      this.constructPath();
      return;
    }

    for (const ng of this.grid.getNeighbours(node)) {
      if (ng.closed) {
        continue;
      }

      let costToNeighbour = this.getDistance(node, ng);
      let neighbourGCost = this.gCost(node) + costToNeighbour;

      if (!ng.opened || neighbourGCost < this.gCost(ng)) {
        if (!ng.opened) {
          this.openList.push(ng);
        }

        ng.opened = true;
        this.setGCost(ng, neighbourGCost);
        this.setHCost(ng, this.getDistance(ng, this.dest));
        ng.parent = node;
      }
    }
  }

  private getDistance(nodeA: Node, nodeB: Node) {
    let dx = Math.abs(nodeA.tileX - nodeB.tileX);
    let dy = Math.abs(nodeA.tileY - nodeB.tileY);

    return dx + dy;
  }

  private gCost(node: Node) {
    return this._gCosts.get(node) || 0;
  }

  private setGCost(node: Node, cost: number) {
    this._gCosts.set(node, cost);
  }

  private hCost(node: Node) {
    return this._hCosts.get(node) || 0;
  }

  private setHCost(node: Node, cost: number) {
    this._hCosts.set(node, cost);
  }

  private fCost(node: Node) {
    return this.gCost(node) + this.hCost(node);
  }
}
