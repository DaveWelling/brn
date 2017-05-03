import {updateListItemWithResult, appendResultToNewRecords} from '../../helpers/listHelpers';

export default function submitSuccessReducer(state, action) {
    let newRecords = state.newRecords || [];
    let items = state.items;
    let totalItems = state.total_items;
    let totalPages = state.total_pages;

    if (state.isNew) { //successful insert of a new item
        const pageSize = state.page_size;
        newRecords = appendResultToNewRecords(newRecords, action.submit.activeRecord);
        totalItems = totalItems + 1;
        totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
    }
    else if (action.submit.result && items) { //successful update of an item
        items = updateListItemWithResult(items, action.submit.result);
    }

    return {
        ...state,
        isDirty: true,
        isNew: false,
        activeRecord: {},
        items: items,
        total_items: totalItems,
        total_pages: totalPages,
        newRecords: newRecords
    };
}