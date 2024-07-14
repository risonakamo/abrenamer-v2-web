<script lang="ts">
  /** a image tile representing an item to be renamed. item does not actually have to be
   *  an image */

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

  // controls which fit class appears
  var isWide:boolean=false;
  var isTall:boolean=false;
  var isLoading:boolean=true;

  // image mode enabled if img src is filled out
  var imageMode:boolean=!!imgSrc;

  // the img element ref
  var imageRef:HTMLImageElement;

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
</script>

<style lang="sass">
  @import "./image-tile.sass"
</style>

<div class="image-tile">
  <div class="img-contain" class:selected={selected}>
    <div class="selected-overlay">
      <p>{selectedCount}</p>
    </div>

    {#if imageMode}
      <img src={imgSrc} on:load={h_imgLoad} alt="missing img" bind:this={imageRef}
        class:wide-fit={isWide} class:tall-fit={isTall} class:loading={isLoading}/>
    {:else}
      <p class="filetype">{fileType}</p>
    {/if}
  </div>
  <div class="caption">
    {fileName}
  </div>
</div>