// exposing electron api funcs

export const {
    setItemsData,
    getItemsData,
    clearItemsData,
    getDefaultOutputDir,
    doRename,
}=((window as any).electron as Bridge);