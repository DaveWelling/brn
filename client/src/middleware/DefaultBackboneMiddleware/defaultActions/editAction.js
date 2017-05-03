import { getUrlForRelation, get } from '../../../api/generalPurposePersistence';
import {beginAjaxCall, ajaxCallError, endAjaxCall} from '../../../actions/ajaxStatusActions';

export default function editAction(store, action, next) {

    if (action.type.endsWith('_SUCCESS') ||
        action.type.endsWith('_FAILURE') ||
        action.type.endsWith('_UNNECESSARY')) {
        return next(action);
    }
    const namespace = action.edit.namespace || action.type.split('_')[1].toLowerCase();
    const relation = action.edit.relation || action.type.split('_')[2].toLowerCase();
    const url = getUrlForRelation(
        namespace,
        relation,
        action.edit.id
    );
    store.dispatch(beginAjaxCall());
    get(url).then(result => {
        store.dispatch({ type: action.type + '_SUCCESS', edit: { activeRecord: result } });        
        store.dispatch(endAjaxCall());
    }).catch(error => {
        store.dispatch({ type: action.type + '_FAILURE', edit: { errors:[error]} });
        store.dispatch(ajaxCallError(error));
    });
    return next(action);
}
