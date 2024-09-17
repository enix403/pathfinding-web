<script context="module" lang="ts">
  export interface AlgorithmOptionData {

  }
</script>


<script lang="ts">
  export let title: string;
  export let active: boolean = false;
</script>

<button on:click class="dropdown-item text-sm text-left">
  <p class="flex items-center gap-x-2">
    <span class="dot dot-success" class:invisible={!active} />
    {title}
  </p>
</button>
