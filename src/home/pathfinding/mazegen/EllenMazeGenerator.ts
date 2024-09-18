import { Node } from "../Node";
import { Grid } from "../Grid";
import { MazeGenerator } from "./MazeGenerator";

class DisjointSets {
  // setId -> set
  private setIdToSet: Map<number, Set<Node>> = new Map();
  // Node -> setId
  private nodeToSetId: Map<Node, number> = new Map();

  // next set id
  private nextSetId = 0;

  private getNextSetId() {
    return this.nextSetId++;
  }

  public makeSet(node: Node) {
    let setId = this.getNextSetId();
    let set = new Set<Node>();

    set.add(node);
    this.setIdToSet.set(setId, set);
    this.nodeToSetId.set(node, setId);
  }

  public findSetId(node: Node) {
    return this.nodeToSetId.get(node);
  }

  public find(node: Node): Set<Node> | null {
    let setId = this.nodeToSetId.get(node);
    if (!setId) return null;

    return this.setIdToSet.get(setId)!;
  }

  public sameSet(nodeA: Node, nodeB: Node) {
    return this.nodeToSetId.get(nodeA) === this.nodeToSetId.get(nodeB);
  }

  // Add a (new) node `nodeB` to the existing set of the
  // node `nodeA`
  public makeAndMerge(nodeA: Node, nodeB: Node) {
    let setId = this.nodeToSetId.get(nodeA)!;
    let set = this.setIdToSet.get(setId)!;

    set.add(nodeB);
    this.nodeToSetId.set(nodeB, setId);
  }

  public merge(nodeA: Node, nodeB: Node) {
    let setIdA = this.nodeToSetId.get(nodeA)!;
    let setIdB = this.nodeToSetId.get(nodeB)!;

    // if (!setIdA || !setIdB) {
    // return;
    // }

    let setA = this.setIdToSet.get(setIdA)!;
    let setB = this.setIdToSet.get(setIdB)!;

    for (const fromSetB of setB) {
      setA.add(fromSetB);
      this.nodeToSetId.set(fromSetB, setIdA);
    }

    setB.clear();
    this.setIdToSet.delete(setIdB);
  }
}

export class EllenMazeGenerator implements MazeGenerator {
  generate(grid: Grid) {
    grid.getNodes().forEach(node => {
      node.walkable = false;
    });

    // ====================================

    let ds = new DisjointSets();

    for (let x = 0; x < grid.NumTilesX - 2; x += 2) {
      let node = grid.getNode(x, 0);
      node.walkable = true;
      ds.makeSet(node);
    }

    const y = 0;

    for (let x = 0; x < grid.NumTilesX - 2; x += 2) {
      let wx = x + 1;
      let nx = x + 2;

      let node = grid.getNode(x, y);
      let wall = grid.getNode(wx, y);
      let ng = grid.getNode(nx, y);

      if (!ds.sameSet(node, ng)) {
        if (Math.random() > 0.5) {
          ds.merge(node, ng);

          wall.walkable = true;
          ng.walkable = true;
        }
      }
    }

    let connectedSets = new Set<number>();

    for (let x = 0; x < grid.NumTilesX; x += 2) {
      let node = grid.getNode(x, y);
      let setId = ds.findSetId(node)!;

      let hasVerticalJoin = connectedSets.has(setId);

      if (true || !hasVerticalJoin || Math.random() > 0.5) {
        // get bottom node
        let wy = y + 1;
        let ny = y + 2;

        let wall = grid.getNode(x, wy);
        let ng = grid.getNode(x, ny);

        ds.makeAndMerge(node, ng);

        wall.walkable = true;
        ng.walkable = true;

        connectedSets.add(setId);
      }
    }
  }
}
