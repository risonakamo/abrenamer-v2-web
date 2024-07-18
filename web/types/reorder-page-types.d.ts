// types for reorder page

/** represents a tracked item */
interface FileItemDataInitial
{
    // full filepath
    filepath:string

    isImage:boolean

    filename:string
    filetype:string
}

/** tracked item extended */
interface FileItemData extends FileItemDataInitial
{
    selected:boolean
    selectedCount:number

    // this should not be filled out if the item is not an image
    imagePath:string|undefined

    onClick():void
}