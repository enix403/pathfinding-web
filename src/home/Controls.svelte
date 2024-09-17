<script>
  import clsx from "clsx";
  import AlgorithmOption from "./AlgorithmOption.svelte";
  import { IconCpu } from "@tabler/icons-svelte";

  const algorithms = [
    { title: "Breadth First Search" },
    { title: "Depth First Search" },
    { title: "A-star Algorithm" },
    { title: "Djikstra Algorithm" },
  ];

  let selectedIndex = -1;
</script>

<div class="dropdown w-full">
  <button
    class={clsx(
      "btn btn-block gap-x-1",
      selectedIndex === -1 ? "btn-solid-primary" : "btn-solid-success"
    )}
  >
    {#if selectedIndex === -1}
      <IconCpu />
      Select Algorithm
    {:else}
      <strong>
        {algorithms[selectedIndex].title}
      </strong>
    {/if}
  </button>

  <div
    class="dropdown-menu dropdown-menu-bottom-right border border-gray-300 mt-2"
  >
    {#each algorithms as algorithm, index (index)}
      <AlgorithmOption
        active={index === selectedIndex}
        title={algorithm.title}
        on:click={() => {
          selectedIndex = index;
          // @ts-ignore
          document.activeElement?.blur();
        }}
      />
    {/each}
  </div>
</div>
