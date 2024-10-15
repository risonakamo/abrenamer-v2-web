<script lang="ts">
  /** a image tile representing an item to be renamed. item does not actually have to be
   *  an image */

  import {createEventDispatcher} from "svelte";

  const dispatch=createEventDispatcher<{
    drop:DragEvent
  }>();

  // --- props
  // image of the item
  export var imgSrc:string|undefined=undefined;
  // filename of the item to display below
  export var fileName:string="missing filename";
  // filetype of item. displayed in place if img src is not provided
  export var fileType:string="???";

  // set selected state
  export var selected:boolean=false;
  export var selectedCount:number=-1;

  export var marked:boolean=false;
  // if true, upon marked changing to true, scrolls into view.
  // 2way - will reset to false on performing the scroll.
  export var focusMarked:boolean=true;



  // --- state vars
  // controls which fit class appears
  var isWide:boolean=false;
  var isTall:boolean=false;
  var isLoading:boolean=true;

  // the img element ref
  var imageRef:HTMLImageElement;

  // tracks drag enter/leaves. when above 0, actively being dragged over
  var dragCounter:number=0;

  var ref:HTMLDivElement;


  // --- derived
  // display the image or not
  var imageMode:boolean;
  var actualSelected:boolean;
  // when enabled, shows the drag over overlay
  var dragOver:boolean=false;

  // image mode changes based on img src
  $: imageMode=!!imgSrc;

  // drag over overrides selected state
  $: actualSelected=selected && !dragOver;

  $: dragOver=dragCounter>0;


  // --- handlers
  /** on image loaded, detect if it is wide or tall. apply the correct fit class, and
   * reveal the image */
  function h_imgLoad():void
  {
    if (imageRef.naturalWidth>imageRef.naturalHeight)
    {
      isWide=true;
      isTall=false;
    }

    else
    {
      isWide=false;
      isTall=true;
    }

    isLoading=false;
  }

  /** on drag enter, inc drag counter */
  function h_dragEnter(e:DragEvent):void
  {
    e.stopPropagation();
    dragCounter++;
  }

  /** drag leave, dec drag counter */
  function h_dragOut(e:DragEvent):void
  {
    e.stopPropagation();
    dragCounter--;
  }

  /** on drop, trigger drop event, but also clear all drag counts */
  function h_drop(e:DragEvent):void
  {
    e.stopPropagation();
    dragCounter=0;
    dispatch("drop",e);
  }

  /** clear drag counts on drag end */
  function h_dragend():void
  {
    dragCounter=0;
  }

  $: {
    if (marked && ref && focusMarked)
    {
      ref.scrollIntoView({block:"nearest"});
      focusMarked=false;
    }
  }
</script>

<style lang="sass">
  @import "./image-tile.sass"
</style>

<div class="image-tile" on:dragenter={h_dragEnter} on:dragleave={h_dragOut}
  on:click on:dragstart on:drop={h_drop} on:dragover|preventDefault
  on:dragend|preventDefault={h_dragend} on:contextmenu|preventDefault
  bind:this={ref}
>
  <div class="img-contain" class:selected={actualSelected} class:drag-over={dragOver}
    draggable={true} class:marked={marked}
  >
    <div class="selected-overlay overlay">
      <p>{selectedCount}</p>
    </div>

    <div class="drag-over-overlay overlay" class:enabled={dragOver}>
      <p>{"->"}</p>
    </div>

    {#if imageMode}
      <img src={imgSrc} on:load={h_imgLoad} alt="missing img" bind:this={imageRef}
        class:wide-fit={isWide} class:tall-fit={isTall} class:loading={isLoading}
        class:selected={actualSelected} draggable={false}
      />
    {:else}
      <p class="filetype" class:selected={actualSelected}>{fileType}</p>
    {/if}
  </div>
  <div class="caption">
    {fileName}
  </div>
</div>