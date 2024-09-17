<script lang="ts">
  import { onMount } from "svelte";
  import { PathFindingScene } from "./pathfinding/PathFindingScene";

  let canvas: HTMLCanvasElement | null = null;

  onMount(() => {
    return PathFindingScene.createGame(canvas!);
  });
</script>

<canvas bind:this={canvas} class="w-full h-full" />
