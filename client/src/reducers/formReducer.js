import initialState from './initialState';
import getStore, {injectAsyncReducer} from '../store';
import ObjectId from '../helpers/ObjectId';

// An instance of this is created whenever a form is needed for the first time.
// Currently, EDIT and NEW actions will create the form if it doesn't exist.
export default function createFormReducer(namespace, relation){
    // Create unique (mostly) human readable id for state.
    const namespaceRelation = `${namespace}_${relation}`.toUpperCase();
    const reducerName = `FORM_${namespaceRelation}`;
    const store = getStore();
    if (store.asyncReducers[reducerName]) return; // Already exists;
    
    initialState[reducerName] = {
        submitting: false,
        errors:[],
        warnings:[]
    };
    const submitActionType = `SUBMIT_${namespaceRelation}`;
    const submitSuccessActionType = `SUBMIT_${namespaceRelation}_SUCCESS`;
    const submitFailActionType = `SUBMIT_${namespaceRelation}_FAILURE`;
    const changeActionType = `CHANGE_${namespaceRelation}`;
    const cancelActionType = `CANCEL_${namespaceRelation}`;
    const removeSuccessActionType = `REMOVE_${namespaceRelation}_SUCCESS`;
    const newSuccessActionType = `NEW_${namespaceRelation}_SUCCESS`;
    const editSuccessActionType = `EDIT_${namespaceRelation}_SUCCESS`;
    const removeFailActionType = `REMOVE_${namespaceRelation}_FAILURE`;
    
    injectAsyncReducer(reducerName, function(state=initialState[reducerName], action){        
        switch (action.type) {
            case newSuccessActionType:
                return {...state, submitting: false, errors: [], warnings: [], 
                    isNew: true, oldModel: action.new.activeRecord || {}, 
                    newModel: action.new.activeRecord || {_id: new ObjectId().toString()}};
            case editSuccessActionType:
                return {...state, submitting: false, errors: [], warnings: [], 
                    isNew: false, oldModel: action.edit.activeRecord, newModel: action.edit.activeRecord};
            case submitActionType:
                return {...state, submitting: true};
            case submitSuccessActionType:
            case cancelActionType:
            case removeSuccessActionType:
                return {...state, submitting: false, errors: [], warnings: [], oldModel: null};
            case submitFailActionType:
                return {...state, submitting: false, errors: action.submit.errors, warnings: action.submit.warnings};
            case removeFailActionType:
                return {...state, submitting: false, errors: action.remove.errors, warnings: action.remove.warnings};
            case changeActionType:
                return {...state,
                    ...action.change
                };
        }
        return state;
    });
} 


