// exposing electron api funcs

export const {
    setItemsData,
    getItemsData,
    getDefaultOutputDir,
}=((window as any).electron as Bridge);