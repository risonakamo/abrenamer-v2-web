// exposing electron api funcs

export const {
    setItemsData,
    getitemsData
}=((window as any).electron as Bridge);