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

  /** move dragged items or selected items to a target.
   *  - drop target: filepath of the item to drop things on. items to be moved will
   *    be placed after this target
   *  - drop group index: index of group to drop items into, as alternative to
   *    drop target. only one of these args can be used at a time.
   *  - if no dragged item, do nothing for now. eventually should detect payload
   *    to perform drop actions
   *  - check if the dragged item is one of the selected. if it is, then move
   *    all selected items to the drop target
   *      - otherwise, only moves the item being dragged
   *  - if the drop target is a group, the drop target will be empty, and a
   *    group index will be provided instead. the drop target will be set as the last item
   *    in the group
   *  - if frontOfGroup is set, and the drop target is not defined, will place it at
   *    the beginning of the group. does not do anything with dropTarget mode
   *  - as such, either the drop target or drop group index must be set, but only
   *    one will be used */
  function moveDraggeditems(
    dropTarget:string|null,
    dropGroupIndex:number|null,
    frontOfGroup:boolean
  ):void
  {
    if (draggedItem==undefined)
    {
      console.warn("no dragged item");
      return;
    }

    // check if the item being dragged is one of the selected items
    const dragItemIsSelected:boolean=_.some(
      selectedFileItemsOrdered,
      (item:string):boolean=>{
        return item==draggedItem?.filepath;
      }
    );

    // move to single drop target mode
    if (dropTarget!=null)
    {
      // if it is, move all selected items to the drop point
      if (dragItemIsSelected)
      {
        fileGroups=moveItemsAfter(
          fileGroups,
          selectedFileItemsOrdered,
          dropTarget,
          false
        );

        selectedFileItemsOrdered=[];
      }

      // otherwise, just move the single item that is being dragged
      else
      {
        fileGroups=moveItemsAfter(
          fileGroups,
          [draggedItem.filepath],
          dropTarget,
          false
        );
      }
    }

    else if (dropGroupIndex!=null)
    {
      const targetFileGroup:FileItemGroup=fileGroups[dropGroupIndex];

      // if the target group is empty
      if (!targetFileGroup.items.length)
      {
        // item is selected. move all the selected items into the group
        if (dragItemIsSelected)
        {
          targetFileGroup.items.push(...selectedFileItemsOrdered);
        }

        // item was not selected. push the single dragged item
        else
        {
          targetFileGroup.items.push(draggedItem.filepath);
        }

        fileGroups=fileGroups;
      }

      // target group is not empty. need to target the last item or 1st item in the group
      else
      {
        var groupDropItem:string|undefined;

        // determine items to move. either all the selected items if the item being dragged is selected,
        // or just the one dragged item
        var itemsToMove:string[]=[];

        if (dragItemIsSelected)
        {
          itemsToMove=selectedFileItemsOrdered;
        }

        else
        {
          itemsToMove=[draggedItem.filepath];
        }

        // back of group mode
        if (!frontOfGroup)
        {
          groupDropItem=_.last(targetFileGroup.items);

          if (!groupDropItem)
          {
            console.error("unable to get last group item");
            return;
          }
        }

        // front of group mode
        else
        {
          groupDropItem=targetFileGroup.items[0];
        }

        fileGroups=moveItemsAfter(
          fileGroups,
          itemsToMove,
          groupDropItem,
          false,
        );
      }
    }

    else
    {
      console.error("did not provide drop target or drop group");
    }
  }



  // --- handlers






  // --- derived
  // construct the rendered file groups which contains the rendered file items
  var renderedFileGroups:RenderedFileGroup[]=[];
  $: {
    let count:number=0;
    renderedFileGroups=_.map(fileGroups,(filegroup:FileItemGroup):RenderedFileGroup=>{
      count++;

      /** dropped in group */
      function h_groupDrop():void
      {

      }

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

          /** dropped on a tile. use the move dragged items, giving the tile that was
           *  just dropped on as the drop target */
          function h_tileDrop():void
          {
            moveDraggeditems(
              item.filepath,
              null,
              false
            );
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