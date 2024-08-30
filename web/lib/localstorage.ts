// funcs to access custom localstorage shape

function getFromStorage<T>(key:string,defaultReturn:T):T
{
    const data:string|null=window.localStorage.getItem(key);

    if (!data)
    {
        return defaultReturn;
    }

    return JSON.parse(data);
}

/** get current items data from storage */
export function getItemsData():ItemsData
{
    return getFromStorage<ItemsData>("fileItemsData",{
        fileItemsData:{},
        fileGroups:[],
    });
}

/** set items data into storage */
export function setItemsData(itemsData:ItemsData):void
{
    window.localStorage.setItem("fileItemsData",JSON.stringify(itemsData));
}