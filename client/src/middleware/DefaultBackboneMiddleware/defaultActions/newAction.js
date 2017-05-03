
export default function newAction(store, action, next) {

    if (action.type.endsWith('_SUCCESS') ||
        action.type.endsWith('_FAILURE') ||
        action.type.endsWith('_UNNECESSARY')) {
        return next(action);
    }
    
    store.dispatch({ type: action.type + '_SUCCESS', new: {...action.new, activeRecord: {} }}); // Empty active record for new relation
    return next(action);
}
