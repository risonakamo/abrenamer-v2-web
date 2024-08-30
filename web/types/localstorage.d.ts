/** localstorage  */
interface AbrenameLocalStorage
{
    fileItemsData:ItemsData
}

/** collection of fields consisting of the current file items data */
interface ItemsData
{
    fileItemsData:FileItemDataDict
    fileGroups:FileItemGroup[]
}