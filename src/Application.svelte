<script lang="ts">
  import { onMount } from "svelte";
  import { createGame } from "./AppScene";

  let canvas: HTMLCanvasElement | null = null;

  onMount(() => {
    return createGame(canvas!);
  });
</script>

<canvas bind:this={canvas} />
