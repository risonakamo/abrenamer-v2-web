// exposing electron api funcs

export const {
    setItemsData,
    getItemsData
}=((window as any).electron as Bridge);