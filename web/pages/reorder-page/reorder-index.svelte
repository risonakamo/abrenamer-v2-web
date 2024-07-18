<script lang="ts">
  import ImageTile from "@/components/image-tile/image-tile.svelte";

  // --- consts
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



  // --- states
  // the rendered file items
  var fileItems:RenderedFileItem[]=[];

  // names of selected files, in selection order
  var selectedFileItemsOrdered:string[]=[];



  // --- state control
  /** toggle selected state of a target filepath. removes or adds to selected items array*/
  function toggleSelectedItem(filepath:string):void
  {
    const foundI:number=selectedFileItemsOrdered.findIndex((item:string):boolean=>{
      return item==filepath;
    });

    if (foundI>=0)
    {
      selectedFileItemsOrdered.splice(foundI,1);
    }

    else
    {
      selectedFileItemsOrdered.push(filepath);
    }

    selectedFileItemsOrdered=selectedFileItemsOrdered;
  }


  // --- handlers
  function h_testdrop(e:DragEvent):void
  {
    e.preventDefault();
    console.log("dropped",e.dataTransfer?.files);
  }




  // --- reactives
  // render of file items array when files item changes or selected items changes.
  $: {
    fileItems=fileItemsData.map((item:FileItemData):RenderedFileItem=>{
      /** clicked on tile. toggle the item from selected */
      function h_tileClick():void
      {
        toggleSelectedItem(item.filepath);
      }

      // image path is set to the filepath if the item is an img
      var imagePath:string|undefined=undefined;

      if (item.isImage)
      {
        imagePath=item.filepath;
      }

      const selectedItemIndex:number=selectedFileItemsOrdered.findIndex((selectedItem:string):boolean=>{
        return selectedItem==item.filepath;
      });

      const selected:boolean=selectedItemIndex>=0;

      return {
        ...item,
        imagePath,
        selected,
        selectedCount:selectedItemIndex+1,
        onClick:h_tileClick
      };
    });
  }
</script>

<style lang="sass">
  @import "./reorder-index.sass"
</style>

<main on:drop={h_testdrop} on:dragover|preventDefault>
  <div class="top-zone">

  </div>
  <div class="tiles">
    {#each fileItems as item (item.filepath)}
      <ImageTile imgSrc={item.imagePath} fileName={item.filename}
        fileType={item.filetype} selected={item.selected} on:click={item.onClick}
        selectedCount={item.selectedCount}/>
    {/each}
  </div>
  <div class="status-bar">

  </div>
</main>