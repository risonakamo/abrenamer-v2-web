<script lang="ts">
  import {createEventDispatcher} from "svelte";

  const dispatch=createEventDispatcher<{
    drop:void
  }>();

  export var title:string="";
  export var numItems:number=0;

  var dragCount:number=0;

  function h_dragEnter():void
  {
    dragCount++;
  }

  function h_dragOut():void
  {
    dragCount--;
  }

  function h_dragend():void
  {
    dragCount=0;
    dispatch("drop");
  }

  var draggedOver:boolean=false;
  $: draggedOver=dragCount>0;
</script>

<style lang="sass">
  @import "./file-item-group-container.sass"
</style>

<div class="file-item-group-container" class:drag-over={draggedOver}
  on:dragenter={h_dragEnter} on:dragleave={h_dragOut} on:drop={h_dragend}
  on:dragend={h_dragend}
>
  <h2>{title} ({numItems})</h2>
  <div class="contents">
    <slot/>
  </div>
</div>