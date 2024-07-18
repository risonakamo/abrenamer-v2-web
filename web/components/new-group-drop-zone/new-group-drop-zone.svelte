<script lang="ts">
  /** a drop zone that can be clicked on */

  // disable the drop zone because there are no items to form a new group from.
  export var disabledNoItems:boolean=false;

  // appearance when dragged over
  export var draggedOver:boolean=false;
</script>

<style lang="sass">
  @import "./new-group-drop-zone.sass"
</style>

<div class="new-group-drop-zone" class:no-items-disabled={disabledNoItems}
 class:drag-over={draggedOver && !disabledNoItems}
>
  {#if !disabledNoItems}
    <p>+ new group</p>
  {:else}
    <p>No Items Selected</p>
  {/if}
</div>