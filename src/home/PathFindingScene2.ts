import Phaser from "phaser";
import { BaseScene } from "~/scene/BaseScene";
import { Vector } from "~/math/vector";
import { Node } from './pathfinding/Node';

export const COLOR_BLUE = 0x0a78cc;
export const COLOR_DIM_BLUE = 0x072942;
export const COLOR_YELLOW = 0xf2e707;
export const COLOR_RED = 0xeb3a34;
export const COLOR_GREEN = 0x37eb34;
export const COLOR_CYAN = 0x15edc2;
export const COLOR_ORANGE = 0xba7816;

export class PathFindingScene2 extends BaseScene {

  public create() {
    let worldTopLeft = Vector.zero;
    let gridWorldSize = new Vector(
      //
      +this.game.config.width,
      +this.game.config.height
    );

    let tileSize = 25;
    let pad = 1;

    let numTilesX = Math.floor((gridWorldSize.x + pad) / (tileSize + pad));
    let numTilesY = Math.floor((gridWorldSize.y + pad) / (tileSize + pad));

    // Adjust the tileSize by a little amount so that there is
    // no empty space at the end
    tileSize = (gridWorldSize.x + pad) / numTilesX - pad;

    for (let y = 0; y < numTilesY; ++y) {
      for (let x = 0; x < numTilesX; ++x) {
        let worldX = worldTopLeft.x + (tileSize + pad) * x;
        let worldY = worldTopLeft.y + (tileSize + pad) * y;

        let node = new Node(this, x, y, worldX, worldY, tileSize);
        node.setColor(0xffffff);
        // nodes.push(node);
      }
    }
  }

  public static createGame(canvas: HTMLCanvasElement) {
    let rect = canvas.getBoundingClientRect();

    let scene = new PathFindingScene2();

    let game = new Phaser.Game({
      scene: scene,
      canvas: canvas,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      backgroundColor: "#6EB1A5",
      type: Phaser.CANVAS,
      powerPreference: "high-performance",
      audio: { noAudio: true },
      banner: false
    });

    return () => {
      scene.destroy();
      game.destroy(false);
    };
  }
}
