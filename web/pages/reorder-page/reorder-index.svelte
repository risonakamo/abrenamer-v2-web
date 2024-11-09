<script lang="ts">
import _ from "lodash";
import {extname,basename} from "path-browserify";
import normalise from "normalize-path";
import {onMount} from "svelte";

import ImageTile from "@/components/image-tile/image-tile.svelte";
import NewGroupDropZone from "@/components/new-group-drop-zone/new-group-drop-zone.svelte";
import FileItemGroupContainer
  from "@/components/file-item-group-container/file-item-group-container.svelte";
import {moveItemsAfter, moveItemsIntoGroup, purgeEmptyGroups,
  purgeItemsFromGroups} from "@/lib/file-group";
import DragProxy from "@/components/drag-proxy/drag-proxy.svelte";
import {filesListToPathList, isImage,normalisePaths} from "@/lib/path-lib";
import InitialDropZone from "@/components/initial-drop-zone/initial-drop-zone.svelte";
import Button1 from "@/components/button1/button1.svelte";
import {getItemsData, setItemsData} from "@/api/bridge-api";
import DropZone2 from "@/components/drop-zone2/drop-zone2.svelte";
import PreviewOverlay from "@/components/preview-overlay/preview-overlay.svelte";
import {Trash} from "lucide-svelte";

/** load data from localstorage */
onMount(async ()=>{
  const data:ItemsData=await getItemsData();

  fileItemsData=data.fileItemsData;
  fileGroups=data.fileGroups;
});

// --- states
// all file items data in no particular order
var fileItemsData:FileItemDataDict=$state({});

// selected files, in selection order. uses filepath as key
var selectedFileItemsOrdered:string[]=$state([]);

// ordering of the items. uses filepath as key
var fileGroups:FileItemGroup[]=$state([]);

// item currently being dragged. the string is the full filepath of the item (uniquely identifying it)
var draggedItem:string|undefined=$state(undefined);

// is the preview overlay showing or not
var previewOverlayShowing:boolean=$state(false);

// the img that is currently being previewed
var previewOverlayImg:string|undefined=$state(undefined);

// enable scrolling to the marked tile
var focusMarked:boolean=$state(false);



// --- funcs
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
  const dragItemIsSelected:boolean=itemIsSelected(draggedItem);

  // determine the items that are about to be moved. if the dragged item is selected,
  // move all the selected items. otherwise, just move the single dragged item
  var moveTargets:string[]=[];

  if (dragItemIsSelected)
  {
    moveTargets=selectedFileItemsOrdered;
  }

  else
  {
    moveTargets=[draggedItem];
  }

  // move to single drop target mode
  if (dropTarget!=null)
  {
    fileGroups=purgeEmptyGroups(moveItemsAfter(
      fileGroups,
      moveTargets,
      dropTarget,
      false
    ));
  }

  // drop into group mode
  else if (dropGroupIndex!=null)
  {
    fileGroups=purgeEmptyGroups(moveItemsIntoGroup(
      fileGroups,
      moveTargets,
      dropGroupIndex,
      "front",
    ));
  }

  else
  {
    console.error("did not provide drop target or drop group");
  }

  // after the move, clear all selected items, if the dragged item was selected
  if (dragItemIsSelected)
  {
    selectedFileItemsOrdered=[];
  }
}

/** cause all selected items to be moved into a new group. also deselects all
 *  selected items */
function newGroupFromSelectedItems():void
{
  // does nothing if nothing is selected
  if (!selectedFileItemsOrdered.length)
  {
    return;
  }

  addItemsToNewGroup(selectedFileItemsOrdered);

  selectedFileItemsOrdered=[];
}

/** add all target items to a new group. still need to add it to item tracking dict */
function addItemsToNewGroup(items:string[]):void
{
  addItemsToItemsData(items);

  // add a new group
  fileGroups.push({
    name:"",
    items:[],
  });

  const newGroupIndex:number=fileGroups.length-1;

  fileGroups=moveItemsIntoGroup(
    fileGroups,
    items,
    newGroupIndex,
    "front",
  );
}

/** add all full paths to items data dict */
function addItemsToItemsData(paths:string[]):void
{
  const newFileItemsData:FileItemDataDict=_.cloneDeep(fileItemsData);

  // insert new items into the file items data tracking dict
  for (let itemI=0;itemI<paths.length;itemI++)
  {
    const item:string=normalise(paths[itemI]);

    const filetype:string=extname(item);

    newFileItemsData[item]={
      filepath:item,
      filename:basename(item),
      filetype,
      isImage:isImage(item),
      isFolder:filetype.length==0,
    };
  }

  fileItemsData=newFileItemsData;
}

/** add list of filepaths as new items to be tracked. adds it after the target item, or group,
 *  if group target is given. only 1 target arg should be used. */
function addItems(
  newItems:string[],
  target:string|null,
  groupTarget:number|null,
):void
{
  addItemsToItemsData(newItems);

  var newGroups:FileItemGroup[]=_.cloneDeep(fileGroups);

  if (target!=null)
  {
    // use move items after to insert the new items into the group list after the target drop item
    newGroups=moveItemsAfter(
      newGroups,
      newItems,
      target,
      false,
    )
  }

  else if (groupTarget!=null)
  {
    newGroups=moveItemsIntoGroup(
      newGroups,
      newItems,
      groupTarget,
      "back",
    );
  }

  else
  {
    console.error("no target was specified");
    throw "no target";
  }

  fileGroups=newGroups;
}

/** add list of new items to a new group and track them */
function addNewItemsToNewGroup(items:string[]):void
{
  addItemsToNewGroup(items);
  addItemsToItemsData(items);
}

/** check if target item is one of the selected items */
function itemIsSelected(item:string):boolean
{
  return _.some(
    selectedFileItemsOrdered,
    (selecteditem:string):boolean=>{
      return selecteditem==item;
    }
  );
}

/** delete the selected items from all states */
function deleteItems(items:string[]):void
{
  const itemsSet:Set<string>=new Set(...items);

  const newgroups:FileItemGroup[]=purgeItemsFromGroups(
    fileGroups,
    items,
  );

  const newItems:FileItemDataDict=_.omitBy(fileItemsData,(__,itemPath:string):boolean=>{
    return itemsSet.has(itemPath);
  });

  fileItemsData=newItems;
  fileGroups=purgeEmptyGroups(newgroups);
}






// --- handlers
/** clicked on the group zone. move all selected items into a new group */
function h_groupZoneClick():void
{
  newGroupFromSelectedItems();
}

/** started dragging the proxy. set the dragged item to the first of the selected items.
 *  if none, then nothing because that shouldn't happen */
function h_dragProxyStart():void
{
  if (!selectedFileItemsOrdered.length)
  {
    return;
  }

  draggedItem=selectedFileItemsOrdered[0];
}

/** dropped items in the initial zone. add the items as new items */
function h_initialZoneDrop(e:DragEvent):void
{
  if (!e.dataTransfer?.files.length)
  {
    return;
  }

  const files:string[]=filesListToPathList(e.dataTransfer?.files);

  addItemsToNewGroup(files);
}

/** clicked rename button. set data into storage, navigate to rename page */
function h_renameButtonClick():void
{
  setItemsData({
    fileItemsData,
    fileGroups,
  });
  window.location.href="rename-page.html";
}

/** dropped items into new group zone. if there are any items, add them to a new group.
 *  if not, add the dragged item into new group. if the dragged item is selected, add
 *  all selected items into a new group */
function h_dropInGroupZone(e:CustomEvent<string[]>):void
{
  // if new items, create new group and place in new items
  if (e.detail.length)
  {
    addNewItemsToNewGroup(e.detail);
  }

  else if (draggedItem)
  {
    const draggedItemSelected:boolean=itemIsSelected(draggedItem);

    // if dragged item is one of the selected items
    if (draggedItemSelected)
    {
      newGroupFromSelectedItems();
    }

    // otherwise, dragged an unselected item into the zone
    else
    {
      addItemsToNewGroup([draggedItem]);
    }
  }
}

/** clicked remove zone. remove the currently selected items. unselects all items */
function h_removeZoneClick():void
{
  deleteItems(selectedFileItemsOrdered);
  selectedFileItemsOrdered=[];
}

/** dropped in delete zone. remove the currently dragged item, or, if the dragged item is selected
 *  remove all the selected items. */
function h_dropDeleteZone():void
{
    if (!draggedItem)
    {
        return;
    }

    const draggedItemSelected:boolean=itemIsSelected(draggedItem);

    // if item is not selected and is alone, delete just the dragged item
    if (!draggedItemSelected)
    {
        deleteItems([draggedItem]);
        draggedItem=undefined;
    }

    // if dragged item is selected, do the same thing as remove zone click
    else
    {
        h_removeZoneClick();
    }
}

/** preview overlay triggered close event */
function h_overlayClose():void
{
  previewOverlayShowing=false;
}

/** on performing navigate with overlay, set focus marked so tile gets focused */
function h_overlayNavigated():void
{
  focusMarked=true;
}







// --- derived
// construct the rendered file groups which contains the rendered file items
var renderedFileGroups:RenderedFileGroup[]=$derived.by(()=>{
  let count:number=0;
  return _.map(fileGroups,(filegroup:FileItemGroup,i:number):RenderedFileGroup=>{
    count++;

    /** dropped in group.
     *  - if dropped items from outside, add the new items to the group.
     *  - otherwise, call move dragged items with the group index as the target.
     *  todo: if shift key is held, drop front of group. */
    function h_groupDrop(e:CustomEvent<DragEvent>):void
    {
      // files from external drop
      if (e.detail.dataTransfer?.files.length)
      {
        const files:string[]=filesListToPathList(e.detail.dataTransfer.files);

        addItems(
          files,
          null,
          i,
        );

        return;
      }

      moveDraggeditems(
        null,
        i,
        false
      );
    }

    return {
      name:`#${count}`,
      onDrop:h_groupDrop,
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
          draggedItem=item.filepath;
        }

        /** dropped on a tile.
         *  - if the items being dragged are external, insert the new items.
         *  - otherwise, if there is a selected item, use the move dragged items, giving
         *    the tile that was just dropped on as the drop target. */
        function h_tileDrop(e:CustomEvent<DragEvent>):void
        {
          e.detail.preventDefault();

          // the dragged item had new files. perform add items, using the item that was dropped
          // on as the target.
          if (e.detail.dataTransfer?.files.length)
          {
            console.log(e.detail.dataTransfer.files);

            const files:string[]=filesListToPathList(e.detail.dataTransfer.files);

            addItems(
              files,
              filepath,
              null,
            );
            return;
          }

          moveDraggeditems(
            item.filepath,
            null,
            false
          );
        }

        /** right clicked on a tile. open the preview to this tile's item */
        function h_tileRClick():void
        {
          previewOverlayImg=filepath;
          previewOverlayShowing=true;
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

        const itemIsBeingPreviewed:boolean=filepath==previewOverlayImg;

        return {
          ...item,
          imagePath,
          selected,
          selectedCount:selectedItemIndex+1,
          onClick:h_tileClick,
          onDragStart:h_tileDragStart,
          onDrop:h_tileDrop,
          onRClick:h_tileRClick,
          marked:itemIsBeingPreviewed,
        };
      })
    };
  });
});

// initial drop zone is shown when there are no items
var showInitialDropZone:boolean=$derived(_.size(fileItemsData)==0);
</script>

<style lang="sass">
  @use "./reorder-index.sass"
</style>

<main>
  {#if previewOverlayShowing}
    <PreviewOverlay bind:currentImg={previewOverlayImg} on:close={h_overlayClose}
      fileGroups={fileGroups} on:navigated={h_overlayNavigated}/>
  {/if}

  <div class="top-zone">
    <div class="drag-handler-zone">
      <DragProxy selectedCount={selectedFileItemsOrdered.length} on:dragstart={h_dragProxyStart}/>
    </div>
    <div class="new-group-drop-zone-zone">
      <NewGroupDropZone on:click={h_groupZoneClick} on:drop={h_dropInGroupZone}/>
      <DropZone2 on:click={h_removeZoneClick} on:drop={h_dropDeleteZone}>
        <div slot="active" class="dropzone-container">
          <p><Trash/></p>
          <p>Remove Items</p>
        </div>
        <p slot="disabled">No Items To Remove</p>
      </DropZone2>
    </div>
    <div class="rename-button-zone">
      <Button1 text="Rename" on:click={h_renameButtonClick}/>
    </div>
  </div>

  {#if showInitialDropZone}
    <InitialDropZone on:drop={h_initialZoneDrop}/>
  {:else}
    <div class="tiles">
      {#each renderedFileGroups as filegroup}
        <FileItemGroupContainer title={filegroup.name} numItems={filegroup.items.length}
          on:drop={filegroup.onDrop}>
        {#each filegroup.items as item (item.filepath)}
          <ImageTile imgSrc={item.imagePath} fileName={item.filename}
            fileType={item.filetype} selected={item.selected} on:click={item.onClick}
            selectedCount={item.selectedCount} on:dragstart={item.onDragStart}
            on:drop={item.onDrop} on:contextmenu={item.onRClick} marked={item.marked}
            bind:focusMarked={focusMarked} folder={item.isFolder}
          />
        {/each}
        </FileItemGroupContainer>
      {/each}
    </div>
  {/if}

  <div class="status-bar">

  </div>
</main>

<svelte:document on:drop|preventDefault/>