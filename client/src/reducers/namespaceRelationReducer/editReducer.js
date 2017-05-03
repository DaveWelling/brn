import {updateListItemWithResult} from '../../helpers/listHelpers';

export default function editReducer(state, action) {
    let isNew = false;
    let activeRecord = action.edit.activeRecord;
    
    if (action.type.endsWith('SUCCESS')){
        let items = updateListItemWithResult(state.items, action.edit.activeRecord);
        return {...state, isNew, activeRecord, items};
    } 
    return {...state, isNew, activeRecord};
}
