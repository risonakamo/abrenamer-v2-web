// types from backend

/** list of lists of full paths. each 1st level group will become a folder based on
 *  the group rename rule */
type GroupedPaths=string[][]

/** possible rename action modes */
type RenameMode="move"|"copy"

type RenameRequestStatusType="success"|"error"|"info"

/** api available to frontend */
interface Bridge
{
    setItemsData(items:ItemsData):void
    getItemsData():Promise<ItemsData>
    clearItemsData():Promise<void>
    getDefaultOutputDir():Promise<string>
    doRename(renameRequest:RenameRequest):Promise<RenameRequestStatus>
    openExplorer(path:string):void
}

/** collection of fields consisting of the current file items data */
interface ItemsData
{
    fileItemsData:FileItemDataDict
    fileGroups:FileItemGroup[]
}

/** request to do rename */
interface RenameRequest
{
    items:GroupedPaths
    groupRenameRule:string
    itemRenameRule:string
    outputDir:string
    renameMode:RenameMode
}

/** result of rename request operation */
interface RenameRequestStatus
{
    status:RenameRequestStatusType
    description:string
}