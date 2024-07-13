<script lang="ts">
  // --- props
  export var imgSrc:string;

  // controls which fit class appears
  var isWide:boolean=false;
  var isTall:boolean=false;
  var isLoading:boolean=true;

  // the img element ref
  var imageRef:HTMLImageElement;

  /** on image loaded, detect if it is wide or tall. apply the correct fit class, and
   * reveal the image */
  function h_imgLoad():void
  {
    console.log("loaded",imageRef.naturalWidth,imageRef.naturalHeight);

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
  <img src={imgSrc} on:load={h_imgLoad} alt="missing img" bind:this={imageRef}
    class:wide-fit={isWide} class:tall-fit={isTall} class:loading={isLoading}/>
</div>