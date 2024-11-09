// types for reorder page

/** file item data keyed by their path
 *  key: filepath
 *  val: the file item */
type FileItemDataDict=Record<string,FileItemData>

/** data of a file item */
interface FileItemData
{
    // full filepath
    filepath:string

    isImage:boolean
    isFolder:boolean

    filename:string
    filetype:string
}

/** file item for rendering */
interface RenderedFileItem extends FileItemData
{
    selected:boolean
    selectedCount:number
    marked:boolean
    lastItemFocus:boolean

    // this should not be filled out if the item is not an image
    imagePath:string|undefined

    onClick():void
    onDragStart():void
    onDrop(e:CustomEvent<DragEvent>):void
    onRClick():void
    onFocusOther():void
}

/** group of file items */
interface FileItemGroup
{
    name:string
    // filepaths of items that are in the group
    items:string[]
}

/** file item group for rendering */
interface RenderedFileGroup
{
    name:string
    items:RenderedFileItem[]
    onDrop(e:CustomEvent<DragEvent>):void
}

/** position of an item within a FileItemGroup[] */
interface FileItemPosition
{
    // position of the item relative to groups as
    // if all groups were flattened
    overallPosition:number

    // position of the item relative to it's current group
    localPosition:number

    // total number of all items
    totalItems:number

    // total number of local items
    totalLocalItems:number
}