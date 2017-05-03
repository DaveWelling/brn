
export default function loadSuccessReducer(state, action) {
    // merge with existing state.
    let items;
    if (action.load.appendResults && state) {
        items = state.items.concat(action.load.items);
    } else {
        items = action.load.items;
    }
    return {
        ...state,
        ...action.load,
        items: items,
        isDirty: action.load.isDirty || false,
        order_by: action.load.order_by || '',
        newRecords: []
    };
}
