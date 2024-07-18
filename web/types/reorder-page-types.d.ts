// types for reorder page

/** data of a file item */
interface FileItemData
{
    // full filepath
    filepath:string

    isImage:boolean

    filename:string
    filetype:string
}

/** file item for rendering */
interface RenderedFileItem extends FileItemData
{
    selected:boolean
    selectedCount:number

    // this should not be filled out if the item is not an image
    imagePath:string|undefined

    onClick():void
}