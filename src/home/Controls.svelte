<script lang="ts">
  import clsx from "clsx";
  import DropdownOption from "./DropdownOption.svelte";

  import {
    IconCpu,
    IconWall,
    IconEraser,
    IconTopologyStar3
  } from "@tabler/icons-svelte";
  import type { PathFindingController } from "./pathfinding/PathFindingController";

  export let controller: PathFindingController;

  const algorithms = [
    { title: "Breadth First Search" },
    { title: "Depth First Search" },
    { title: "A-star Algorithm" },
    { title: "Djikstra Algorithm" }
  ];

  let selectedAlgorithmIndex = -1;

  const mazeFills = [
    { title: "No Maze" },
    { title: "Recurisve Divide" },
    { title: "Recurisve Backtracking" },
    { title: "Binary Tree Maze" }
  ];

  let selectedMazeIndex = 0;

  let paintMode: "wall" | "erase" = "wall";
  let speed: "slow" | "fast" | "faster" = "fast";
</script>

<p class="font-semibold text-sm">Select Algorithm</p>
<div class="dropdown w-full mt-2">
  <button
    class={clsx(
      "btn btn-block gap-x-1",
      selectedAlgorithmIndex === -1 ? "btn-solid-primary" : "btn-solid-success"
    )}
  >
    {#if selectedAlgorithmIndex === -1}
      <IconCpu />
      Select Algorithm
    {:else}
      <strong>
        {algorithms[selectedAlgorithmIndex].title}
      </strong>
    {/if}
  </button>

  <div
    class="dropdown-menu dropdown-menu-bottom-right border border-gray-300 mt-2"
  >
    {#each algorithms as algorithm, index (index)}
      <DropdownOption
        active={index === selectedAlgorithmIndex}
        title={algorithm.title}
        on:click={() => {
          selectedAlgorithmIndex = index;
          // @ts-ignore
          document.activeElement?.blur();
        }}
      />
    {/each}
  </div>
</div>

<p class="font-semibold text-sm mt-4">Select Maze</p>
<div class="dropdown w-full mt-2">
  <button class={clsx("btn btn-block gap-x-1 btn-solid-success")}>
    <strong>
      {mazeFills[selectedMazeIndex].title}
    </strong>
  </button>

  <div
    class="dropdown-menu dropdown-menu-bottom-right border border-gray-300 mt-2"
  >
    {#each mazeFills as mazeFill, index (index)}
      <DropdownOption
        active={index === selectedMazeIndex}
        title={mazeFill.title}
        on:click={() => {
          selectedMazeIndex = index;
          // @ts-ignore
          document.activeElement?.blur();
        }}
      />
    {/each}
  </div>
</div>

<p class="font-semibold text-sm mt-4">Paint Mode</p>
<div class="flex mt-2 gap-x-1">
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-primary={paintMode === "wall"}
    on:click={() => {
      paintMode = "wall";
    }}
  >
    <IconWall size={20} />
    Wall
  </button>
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-secondary={paintMode === "erase"}
    on:click={() => {
      paintMode = "erase";
    }}
  >
    <IconEraser size={20} />
    Erase
  </button>
</div>

<p class="font-semibold text-sm mt-4">Speed</p>
<div class="flex mt-2 gap-x-1">
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-secondary={speed === "slow"}
    on:click={() => {
      speed = "slow";
    }}
  >
    Slow
  </button>
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-primary={speed === "fast"}
    on:click={() => {
      speed = "fast";
    }}
  >
    Fast
  </button>
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-error={speed === "faster"}
    on:click={() => {
      speed = "faster";
    }}
  >
    Faster
  </button>
</div>

<button
  class="btn btn-success gap-x-2 mt-8"
  on:click={() => {
    // .. run algorihm
    controller.startPathFinding();
  }}
>
  <IconTopologyStar3 size={20} />
  <strong>Run Algorithm</strong>
</button>
