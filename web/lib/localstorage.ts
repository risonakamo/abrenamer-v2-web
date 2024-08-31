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