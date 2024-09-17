<script lang="ts">
  import { onMount } from "svelte";
  import { PathFindingScene } from "./pathfinding/PathFindingScene";
  import { PathFindingController } from "./pathfinding/PathFindingController";
  import type { VoidCallback } from "~/types/utility";

  export let onInit: VoidCallback<PathFindingController> | null = null;

  let canvas: HTMLCanvasElement | null = null;

  onMount(() => {
    const { game, scene } = PathFindingScene.createGame(canvas!);

    let controller = new PathFindingController(scene);
    onInit?.(controller);

    return () => {
      controller?.destroy();
      scene.destroy();
      game.destroy(false);
    };
  });
</script>

<canvas bind:this={canvas} class="w-full h-full" />
