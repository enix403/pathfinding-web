<script>
  import clsx from "clsx";
  import DropdownOption from "./DropdownOption.svelte";

  import { IconCpu } from "@tabler/icons-svelte";

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
