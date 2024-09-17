<script>
  import CanvasGrid from "./CanvasGrid.svelte";
  import Controls from "./Controls.svelte";
</script>

<main class="flex w-full h-full">
  <div class="w-72 border-r-2">
    <aside class="sidebar h-full justify-start">
      <section class="sidebar-title items-center p-4 pb-2">
        <div class="flex flex-col">
          <span>Pathfinding Visualizer</span>
        </div>
      </section>

      <section class="sidebar-content h-fit min-h-[20rem] overflow-visible px-4">
        <Controls />
      </section>
    </aside>
  </div>

  <div class="flex-1">
    <CanvasGrid />
  </div>
</main>
