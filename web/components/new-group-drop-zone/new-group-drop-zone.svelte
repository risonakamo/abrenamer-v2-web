<script lang="ts">
  /** a drop zone that can be clicked on */

  import {createEventDispatcher} from "svelte";
  import {SquareDashed} from "lucide-svelte";
  import {filesListToPathList} from "@/lib/path-lib";

  const dispatch=createEventDispatcher<{
    drop:string[],
  }>();

  // disable the drop zone because there are no items to form a new group from.
  export var disabledNoItems:boolean=false;

  var dragCounter:number=0;

  // appearance when dragged over
  var draggedOver:boolean=false;
  $: draggedOver=dragCounter>0;

  /** dropped on group zone. if have external fileitems, trigger event with the items.
   *  otherwise list is empty - might have triggered with dragging in internal items */
  function h_drop(e:DragEvent):void
  {
    e.preventDefault();
    dragCounter=0;

    if (e.dataTransfer?.files)
    {
      dispatch("drop",filesListToPathList(e.dataTransfer.files));
    }

    else
    {
      dispatch("drop",[]);
    }
  }

  function h_dragEnter(e:DragEvent):void
  {
    e.stopPropagation();
    dragCounter++;
  }

  function h_dragOut():void
  {
    dragCounter--;
  }

  function h_dragEnd():void
  {
    dragCounter=0;
  }
</script>

<style lang="sass">
  @import "./new-group-drop-zone.sass"
</style>

<div class="new-group-drop-zone" class:no-items-disabled={disabledNoItems}
  class:drag-over={draggedOver && !disabledNoItems} on:drop={h_drop}
  on:dragover|preventDefault on:click on:dragenter={h_dragEnter} on:dragleave={h_dragOut}
  on:dragend={h_dragEnd}
>
  {#if !disabledNoItems}
    <p><SquareDashed/></p>
    <p>+ new group</p>
  {:else}
    <p>No Items Selected</p>
  {/if}
</div>