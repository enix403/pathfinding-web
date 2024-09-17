<script>
  import AlgorithmOption from "./AlgorithmOption.svelte";

  const algorithms = [
    { title: "Breadth First Search" },
    { title: "Depth First Search" }
  ];

  let selectedIndex = -1;
</script>

<div class="dropdown">
  <button class="btn btn-solid-primary">
    {#if selectedIndex === -1}
      Select Algorithm
    {:else}
      {algorithms[selectedIndex].title}
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
