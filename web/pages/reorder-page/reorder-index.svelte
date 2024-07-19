<script lang="ts">
  import ImageTile from "@/components/image-tile/image-tile.svelte";
  import NewGroupDropZone from "@/components/new-group-drop-zone/new-group-drop-zone.svelte";
  import FileItemGroupContainer from "@/components/file-item-group-container/file-item-group-container.svelte";

  // --- states
  // all file items data in no particular order
  var fileItemsData:FileItemDataDict={
    "C:/Users/ktkm2/Desktop/newprojs/abrenamer-v2/Bananavarieties.jpg":{
      filepath:"C:/Users/ktkm2/Desktop/newprojs/abrenamer-v2/Bananavarieties.jpg",
      isImage:true,
      filename:"Bananavarieties.jpg",
      filetype:"jpg",
    },
    "somewhere":{
      filepath:"somewhere",
      isImage:false,
      filename:"something.txt",
      filetype:"txt",
    },
    "C:/Users/ktkm2/Desktop/draw/ref/imgs/Annotation 2024-05-10 022025.png":{
      filepath:"C:/Users/ktkm2/Desktop/draw/ref/imgs/Annotation 2024-05-10 022025.png",
      isImage:true,
      filename:"Annotation 2024-05-10 022025.png",
      filetype:"png",
    }
  };

  // selected files, in selection order. uses filepath as key
  var selectedFileItemsOrdered:string[]=[];

  // ordering of the items. uses filepath as key
  var fileGroups:FileItemGroup[]=[
    {
      name:"",
      items:[
        "C:/Users/ktkm2/Desktop/newprojs/abrenamer-v2/Bananavarieties.jpg",
        "C:/Users/ktkm2/Desktop/draw/ref/imgs/Annotation 2024-05-10 022025.png",
      ]
    },
    {
      name:"",
      items:[
        "somewhere"
      ]
    },
    {
      name:"",
      items:[]
    }
  ];



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






  // --- derived
  // construct the rendered file groups which contains the rendered file items
  var renderedFileGroups:RenderedFileGroup[]=[];
  $: {
    let count:number=0;
    renderedFileGroups=fileGroups.map((filegroup:FileItemGroup):RenderedFileGroup=>{
      count++;
      return {
        name:`#${count}`,
        items:filegroup.items.map((filepath:string):RenderedFileItem=>{
          const item:FileItemData=fileItemsData[filepath];

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
        })
      };
    });
  }
</script>

<style lang="sass">
  @import "./reorder-index.sass"
</style>

<main>
  <div class="top-zone">
    <div class="drag-handler-zone">

    </div>
    <div class="new-group-drop-zone-zone">
      <NewGroupDropZone/>
    </div>
  </div>

  <div class="tiles">
    {#each renderedFileGroups as filegroup}
      <FileItemGroupContainer title={filegroup.name} numItems={filegroup.items.length}>
      {#each filegroup.items as item (item.filepath)}
        <ImageTile imgSrc={item.imagePath} fileName={item.filename}
          fileType={item.filetype} selected={item.selected} on:click={item.onClick}
          selectedCount={item.selectedCount}
        />
      {/each}
      </FileItemGroupContainer>
    {/each}
  </div>

  <div class="status-bar">

  </div>
</main>