<script lang="ts">
  import { onMount } from "svelte";
  import { PathFindingScene2 } from "./PathFindingScene2";

  let canvas: HTMLCanvasElement | null = null;

  onMount(() => {
    return PathFindingScene2.createGame(canvas!);
  });
</script>

<canvas bind:this={canvas} class="w-full h-full" />
