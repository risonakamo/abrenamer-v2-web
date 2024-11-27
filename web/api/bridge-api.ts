// exposing electron api funcs

export const {
    setItemsData,
    getItemsData,
    getDefaultOutputDir,
    doRename,
}=((window as any).electron as Bridge);