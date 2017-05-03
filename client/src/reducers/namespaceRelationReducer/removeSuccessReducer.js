export default function removeSuccessReducer(state, action) {
    // merge with existing state.
    const items = state.items;
    const pageSize = state.page_size;
    const updatedItems = removeResultFromList(items, action);
    return {
        ...state,
        isDirty: true,
        isNew: false,
        activeRecord: {},
        items: updatedItems,
        total_items: updatedItems.length,
        total_pages: Math.max(Math.ceil(updatedItems.length / pageSize), 1)
    };
}


function removeResultFromList(items, action) {
    if (!action || !action.id) {
        return items;
    }
    return items.filter(item => {
        return item._id !== action.id;
    });
}