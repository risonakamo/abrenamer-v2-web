<script lang="ts">
  import ImageTile from "@/components/image-tile/image-tile.svelte";

  const fileItemsData:FileItemData[]=[
    {
      filepath:"C:/Users/ktkm2/Desktop/newprojs/abrenamer-v2/Bananavarieties.jpg",
      isImage:true,
      filename:"Bananavarieties.jpg",
      filetype:"jpg",
    },
    {
      filepath:"somewhere",
      isImage:false,
      filename:"something.txt",
      filetype:"txt",
    },
    {
      filepath:"C:/Users/ktkm2/Desktop/draw/ref/imgs/Annotation 2024-05-10 022025.png",
      isImage:true,
      filename:"Annotation 2024-05-10 022025.png",
      filetype:"png",
    }
  ];

  var fileItems:RenderedFileItem[]=[];

  // list of file names that are selected
  var selectedFileItems:Set<string>=new Set();

  // render of file items array
  $: {
    fileItems=fileItemsData.map((item:FileItemData):RenderedFileItem=>{
      /** clicked on tile. toggle the item from selected */
      function h_tileClick():void
      {
        if (selectedFileItems.has(item.filepath))
        {
          selectedFileItems.delete(item.filepath);
        }

        else
        {
          selectedFileItems.add(item.filepath);
        }

        selectedFileItems=selectedFileItems;
      }

      // image path is set to the filepath if the item is an img
      var imagePath:string|undefined=undefined;

      if (item.isImage)
      {
        imagePath=item.filepath;
      }

      return {
        ...item,
        imagePath,
        selected:selectedFileItems.has(item.filepath),
        selectedCount:10,
        onClick:h_tileClick
      };
    });
  }
</script>

<style lang="sass">
  @import "./reorder-index.sass"
</style>

<main>
  <div class="top-zone">

  </div>
  <div class="tiles">
    {#each fileItems as item (item.filepath)}
      <ImageTile imgSrc={item.imagePath} fileName={item.filename}
        fileType={item.filetype} selected={item.selected} on:click={item.onClick}/>
    {/each}
  </div>
  <div class="status-bar">

  </div>
</main>