import Phaser from "phaser";

export class Node {
  private gameObject: Phaser.GameObjects.Rectangle;

  public walkable: boolean = true;

  public opened: boolean = false;
  public closed: boolean = false;
  public pathNode: boolean = false;
  public parent: Node | null = null;

  constructor(
    public scene: Phaser.Scene,
    public readonly tileX: number,
    public readonly tileY: number,
    public worldX: number,
    public worldY: number,
    public worldSize: number
  ) {
    this.gameObject = scene.add
      .rectangle(worldX, worldY, worldSize, worldSize, 0xffffff)
      .setOrigin(0, 0);
  }

  public reset(keepParents = false) {
    this.opened = false;
    this.closed = false;
    this.pathNode = false;

    if (!keepParents)
      this.parent = null;
  }

  public setColor(color: number) {
    // this.gameObject.setFillStyle(color);
  }
}
