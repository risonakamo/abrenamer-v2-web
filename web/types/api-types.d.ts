// types from backend

/** api available to frontend */
interface Bridge
{
    setItemsData(items:ItemsData):void
    getitemsData():Promise<ItemsData>
}

/** collection of fields consisting of the current file items data */
interface ItemsData
{
    fileItemsData:FileItemDataDict
    fileGroups:FileItemGroup[]
}