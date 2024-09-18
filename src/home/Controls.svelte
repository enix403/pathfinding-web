<script lang="ts">
  import clsx from "clsx";
  import DropdownOption from "./DropdownOption.svelte";

  import {
    IconCpu,
    IconWall,
    IconEraser,
    IconTopologyStar3,
    IconPlayerPauseFilled,
    IconRefreshDot
  } from "@tabler/icons-svelte";
  import type { PathFindingController } from "./pathfinding/PathFindingController";
  import { UserPaintMode } from "./pathfinding/UserPaintMode";
  import {
    BFSFinder,
    DFSFinder,
    AStarFinder,
    DijkstraFinder
  } from "./pathfinding/algorithms";

  import { EmptyMazeGenerator } from "./pathfinding/mazegen/EmptyMazeGenerator";
  import { RecursiveDivideGenerator } from "./pathfinding/mazegen/RecursiveDivideGenerator";
  import { RecursiveBacktrackGenerator } from "./pathfinding/mazegen/RecursiveBacktrackGenerator";
  import { EllerMazeGenerator } from "./pathfinding/mazegen/EllerMazeGenerator";
  import { BinaryTreeMazeGenerator } from "./pathfinding/mazegen/BinaryTreeMazeGenerator";

  export let controller: PathFindingController;

  const algorithms = [
    { title: "Breadth First Search", finderClass: BFSFinder },
    { title: "Depth First Search", finderClass: DFSFinder },
    { title: "A-star Algorithm", finderClass: AStarFinder },
    { title: "Djikstra Algorithm", finderClass: DijkstraFinder }
  ];

  let selectedAlgorithmIndex = -1;

  const mazeFills = [
    { title: "Empty Grid", genClass: EmptyMazeGenerator },
    { title: "Recurisve Divide", genClass: RecursiveDivideGenerator },
    { title: "Recurisve Backtracking", genClass: RecursiveBacktrackGenerator },
    { title: "Eller's Algorithm", genClass: EllerMazeGenerator },
    { title: "Binary Tree Algorithm", genClass: BinaryTreeMazeGenerator },
  ];

  let selectedMazeIndex = 0;

  function generateMaze() {
    const genClass = mazeFills[selectedMazeIndex]?.genClass;

    if (!genClass) return;

    controller.generateMaze(new genClass());
  }

  let paintMode: UserPaintMode = UserPaintMode.Wall;
  $: controller.setUserPaintMode(paintMode);

  enum Speed {
    Slow = 220,
    Fast = 50,
    Faster = 10
  }
  let speed = Speed.Fast;

  //
  let running = false;
</script>

<p class="font-semibold text-sm">Select Algorithm</p>
<div class="dropdown w-full mt-2">
  <button
    disabled={running}
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
<div class="flex gap-x-2 items-center mt-2">
  <div class="dropdown flex-1">
    <button
      disabled={running}
      class={clsx("btn btn-block gap-x-1 btn-solid-success")}
    >
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

            setTimeout(() => {
              generateMaze();
            }, 0);
          }}
        />
      {/each}
    </div>
  </div>
  <span class="tooltip tooltip-bottom" data-tooltip="Generate New Maze">
    <button
      on:click={() => {
        generateMaze();
      }}
      disabled={running}
      class="btn btn-circle btn-secondary"
    >
      <IconRefreshDot />
    </button>
  </span>
</div>

<p class="font-semibold text-sm mt-4">Paint Mode</p>
<div class="flex mt-2 gap-x-1">
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-primary={paintMode === UserPaintMode.Wall}
    on:click={() => {
      paintMode = UserPaintMode.Wall;
    }}
  >
    <IconWall size={20} />
    Wall
  </button>
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-secondary={paintMode === UserPaintMode.Erase}
    on:click={() => {
      paintMode = UserPaintMode.Erase;
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
    class:btn-secondary={speed === Speed.Slow}
    on:click={() => {
      speed = Speed.Slow;
    }}
  >
    Slow
  </button>
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-primary={speed === Speed.Fast}
    on:click={() => {
      speed = Speed.Fast;
    }}
  >
    Fast
  </button>
  <button
    class="btn gap-x-1 btn-sm"
    class:btn-error={speed === Speed.Faster}
    on:click={() => {
      speed = Speed.Faster;
    }}
  >
    Faster
  </button>
</div>

<span
  class={clsx(
    "mt-8",
    !running && selectedAlgorithmIndex === -1 && "tooltip tooltip-top"
  )}
  data-tooltip="Select an algorithm first"
>
  <button
    class={clsx("btn w-full gap-x-2", running ? "btn-error" : "btn-success")}
    disabled={selectedAlgorithmIndex === -1}
    on:click={() => {
      if (running) {
        running = false;
        controller.stop();
      } else {
        running = true;
        controller
          .startPathFinding(
            algorithms[selectedAlgorithmIndex].finderClass,
            speed
          )
          .then(() => {
            running = false;
          });
      }
    }}
  >
    {#if running}
      <IconPlayerPauseFilled size={20} />
      <strong>Stop</strong>
    {:else}
      <IconTopologyStar3 size={20} />
      <strong>Run Algorithm</strong>
    {/if}
  </button>
</span>

<div class="flex gap-x-2">
  <button
    class="btn mt-2 btn-solid-warning flex-1"
    disabled={running}
    on:click={() => {
      controller.clear();
    }}
  >
    Clear
  </button>
  <button
    class="btn mt-2 btn-solid-error flex-1"
    disabled={running}
    on:click={() => {
      controller.reset();
    }}
  >
    Reset
  </button>
</div>
