<script lang="ts">
  import _ from "lodash";

  import ImageTile from "@/components/image-tile/image-tile.svelte";
  import NewGroupDropZone from "@/components/new-group-drop-zone/new-group-drop-zone.svelte";
  import FileItemGroupContainer from "@/components/file-item-group-container/file-item-group-container.svelte";
  import {moveItemsAfter} from "@/lib/file-group";

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

  // item currently being dragged
  var draggedItem:FileItemData|undefined=undefined;



  // --- state control
  /** toggle selected state of a target filepath. removes or adds to selected items array*/
  function toggleSelectedItem(filepath:string):void
  {
    const foundI:number=_.findIndex(selectedFileItemsOrdered,(item:string):boolean=>{
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
    renderedFileGroups=_.map(fileGroups,(filegroup:FileItemGroup):RenderedFileGroup=>{
      count++;
      return {
        name:`#${count}`,
        items:_.map(filegroup.items,(filepath:string):RenderedFileItem=>{
          const item:FileItemData=fileItemsData[filepath];

          /** clicked on tile. toggle the item from selected */
          function h_tileClick():void
          {
            toggleSelectedItem(item.filepath);
          }

          /** drag start. set the dragged item */
          function h_tileDragStart():void
          {
            draggedItem=item;
          }

          /** dropped on a tile.
           *  1. if there are multiple selected items, and the item being dragged is one of
           *     those selected items. move all selected items to the dropped tile. then,
           *     clear the selected items.
           *  2. if the dragged item is not selected, only move the dragged item
           *  3. if no dragged item, then the drag came from outside. do nothing for now */
          function h_tileDrop():void
          {
            if (draggedItem==undefined)
            {
              console.warn("no dragged item");
              return;
            }

            // check if the item being dragged is one of the selected items
            const dragItemIsSelected:boolean=_.some(selectedFileItemsOrdered,(item:string):boolean=>{
              return item==draggedItem?.filepath;
            });

            // if it is, move all selected items to the drop point
            if (dragItemIsSelected)
            {
              fileGroups=moveItemsAfter(
                fileGroups,
                selectedFileItemsOrdered,
                item.filepath
              );

              selectedFileItemsOrdered=[];
            }

            // otherwise, just move the single item that is being dragged
            else
            {
              fileGroups=moveItemsAfter(
                fileGroups,
                [draggedItem.filepath],
                item.filepath
              );
            }
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
            onClick:h_tileClick,
            onDragStart:h_tileDragStart,
            onDrop:h_tileDrop
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
          selectedCount={item.selectedCount} on:dragstart={item.onDragStart}
          on:drop={item.onDrop}
        />
      {/each}
      </FileItemGroupContainer>
    {/each}
  </div>

  <div class="status-bar">

  </div>
</main>