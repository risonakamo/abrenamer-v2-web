<script lang="ts">
  /** a drop zone that can be clicked on */

  import {filesListToPathList} from "@/lib/path-lib";
  import {createEventDispatcher} from "svelte";

  const dispatch=createEventDispatcher<{
    drop:string[],
  }>();

  // disable the drop zone because there are no items to form a new group from.
  export var disabledNoItems:boolean=false;

  // appearance when dragged over
  export var draggedOver:boolean=false;

  /** dropped on group zone. if have external fileitems, trigger event with the items.
   *  otherwise list is empty - might have triggered with dragging in internal items */
  function h_drop(e:DragEvent):void
  {
    e.preventDefault();

    if (e.dataTransfer?.files)
    {
      dispatch("drop",filesListToPathList(e.dataTransfer.files));
    }

    else
    {
      dispatch("drop",[]);
    }
  }
</script>

<style lang="sass">
  @import "./new-group-drop-zone.sass"
</style>

<div class="new-group-drop-zone" class:no-items-disabled={disabledNoItems}
  class:drag-over={draggedOver && !disabledNoItems} on:drop={h_drop}
  on:dragover|preventDefault on:click
>
  {#if !disabledNoItems}
    <p>+ new group</p>
  {:else}
    <p>No Items Selected</p>
  {/if}
</div>