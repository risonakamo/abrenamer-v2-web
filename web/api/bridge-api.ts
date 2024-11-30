// exposing electron api funcs

export const {
    setItemsData,
    getItemsData,
    clearItemsData,
    getDefaultOutputDir,
    doRename,
    openExplorer,
}=((window as any).electron as Bridge);