import persistence, {getUrlForRelation} from '../../../api/generalPurposePersistence';
import {beginAjaxCall, ajaxCallError, endAjaxCall} from '../../../actions/ajaxStatusActions';
import removeFailedAction from './removeFailedAction';
import removeSuccessAction from './removeSuccessAction';

export default function removeAction(store, action, next) {
    // Avoid circular call
    if (action.type.endsWith('_SUCCESS')) return removeSuccessAction(store,action,next);
    if (action.type.endsWith('_FAILURE')) return removeFailedAction(store,action,next);
    
    try {
        validateAction(action);

        store.dispatch(beginAjaxCall('Deleting'));
        const url = getUrlForRelation(action.remove.namespace, action.remove.relation, action.remove.id);
        persistence.remove(url).then((result)=> {
            resolve(store, action, result);
            store.dispatch(endAjaxCall());
        }).catch(error=> {
            reject(store,action,error);
            store.dispatch(ajaxCallError());
        });
    } catch(error){
        reject(store,action,error);
    }
    return next(action);
}

function resolve(store, action, result) {
    if (action.remove.resolve) action.remove.resolve(result);
    store.dispatch({type: action.type + '_SUCCESS', remove: {...action.remove, result, errors:[], warnings:[]}});
}

function reject(store, action, error){
    if (action.remove && action.remove.reject) action.remove.reject(error);
    store.dispatch({type: action.type + '_FAILURE', remove:{...action.remove, errors:[error], warnings:[]}});
}

function validateAction(action){
    if (!action.remove.id) throw new Error('All REMOVE actions must contain a remove property with a child id property.');
}