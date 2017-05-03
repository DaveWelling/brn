import loadAction from './defaultActions/loadAction';
import loadNonPagedRecordsAction from './defaultActions/loadNonPagedRecordsAction';
import submitAction from './defaultActions/submitAction';
import removeAction from './defaultActions/removeAction';
import ajaxAction from './ajaxStatusAction';
import editAction from './defaultActions/editAction';
import newAction from './defaultActions/newAction';
import startupActions from './startupActions';
import lazyLoadFormReducers from '../../reducers/formReducer';


export const defaultBackboneMiddleware = store => next => action => {
    // avoid crashing on Redux init actions
    if (!store || !next) {
        return null;
    }

    if (action && action.type) {

        if (action.type.startsWith('EDIT_') || (action.type.startsWith('NEW_'))) {
            let parts = action.type.split('_');
            let namespace = parts[1];
            let relation = parts[2];
            lazyLoadFormReducers(namespace, relation);
        }

        // PUT NON-GENERIC/NON-DEFAULT ACTION HANDLERS UP HERE.
        switch (action.type) {
            case 'STARTUP_BACKBONE_USECASE':
                return startupActions(store, action, next);
        }
        
        // PUT DEFAULT ACTIONS DOWN HERE (They all check the VERB only)
        if(action.type.startsWith('NONPAGEDRECORDS_')) {
            return loadNonPagedRecordsAction(store, action, next);
        } else if (action.type.startsWith('LOAD_')) {
            return loadAction(store, action, next);
        } else if (action.type.startsWith('SUBMIT_')) {
            return submitAction(store, action, next);
        } else if (action.type.startsWith('REMOVE_')) {
            return removeAction(store, action, next);
        } else if (action.type.startsWith('AJAX_')) {
            return ajaxAction(store, action, next);
        } else if (action.type.startsWith('EDIT_')) {
            return editAction(store, action, next);
        } else if (action.type.startsWith('NEW_')) {
            return newAction(store, action, next);
        }

        return next(action);
    }
    return next();
};