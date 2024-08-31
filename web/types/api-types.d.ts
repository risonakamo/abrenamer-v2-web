// types from backend

/** api available to frontend */
interface Bridge
{
    setItemsData(items:ItemsData):void
    getItemsData():Promise<ItemsData>
}

/** collection of fields consisting of the current file items data */
interface ItemsData
{
    fileItemsData:FileItemDataDict
    fileGroups:FileItemGroup[]
}