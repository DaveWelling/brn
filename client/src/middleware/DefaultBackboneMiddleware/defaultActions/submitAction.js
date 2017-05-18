import persistence, {getUrlForRelation} from '../../../api/generalPurposePersistence';
import {compare} from '../../../helpers/jsonPatch';
import {beginAjaxCall, ajaxCallError, endAjaxCall} from '../../../actions/ajaxStatusActions';
import submitFailedAction from './submitFailedAction';
import submitSuccessAction from './submitSuccessAction';

export default function submitAction(store, action, next) {
    // Avoid circular call
    if (action.type.endsWith('_SUCCESS')) return submitSuccessAction(store,action,next);  
    if (action.type.endsWith('_FAILURE')) return submitFailedAction(store,action,next);
    if (action.type.endsWith('_UNNECESSARY')) return next(action);
    
    try {
        if (action.handled) return next(action);
        let state = store.getState();
        const formState = state[`FORM_${action.submit.namespace}_${action.submit.relation}`.toUpperCase()];
        
        let oldModel = formState.oldModel;
        let newModel = formState.newModel;
        let hNode = formState.hNode;
        let errors = [];

        validateAction(action);
        if (errors.length > 0) {
            store.dispatch({type: action.type + '_FAILURE', submit: {...action.submit, errors, warnings:[]}});
            //return next(action);
            return;
            
        }

        if (formState.isNew) {
            // Create/insert a new document
            store.dispatch(beginAjaxCall('Saving'));
            const url = getUrlForRelation(hNode.namespace, hNode.relation);
            persistence.insert(url, newModel).then((result)=> {
                resolve(store, action, result);
                store.dispatch(endAjaxCall());
            }).catch(error => {
                reject(store, action, error);
                store.dispatch(ajaxCallError());
            });
        } else {
            // Change/patch an existing document
            const patch = compare(oldModel, newModel, true);
            if (patch.length === 0) {
                reject(store, action, new Error('There are no changes to save.'));
                return;
            }
            store.dispatch(beginAjaxCall('Saving'));
            const url = getUrlForRelation(hNode.namespace, hNode.relation, newModel._id);
            persistence.update(url, patch).then(()=> {
                resolve(store, action, newModel);
                store.dispatch(endAjaxCall());
            }).catch(error=> {
                if (error.status === 409) {
                    error.message = 'Another user has edited this data. Reload your page.';
                }
                reject(store, action, error);
                store.dispatch(ajaxCallError());
            });
        }
    } catch (error) {
        reject(store, action, error);
    }

    //return next(action);
    
    function resolve(store, action,result) {
        store.dispatch({type: action.type + '_SUCCESS', submit: {...action.submit, ...result, errors:[], warnings:[]}});
    }

    function reject(store, action, error) {
        store.dispatch({type: action.type + '_FAILURE', submit: {...action.submit, errors:[error], warnings:[]}});
    }
}


function validateAction(action) {
    if (!action.submit) throw new Error('All SUBMIT actions must contain a submit property.');
    if (!action.submit) throw new Error('All SUBMIT actions must contain a submit property with a child namespace property.');
    if (!action.submit) throw new Error('All SUBMIT actions must contain a submit property with a child relation property.');
}