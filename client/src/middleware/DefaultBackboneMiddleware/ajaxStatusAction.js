import * as types from '../../actions/actionTypes';

export default function handleAjaxStatusActions(store, action, next) {
    switch(action.type)
    {
        case types.NOTIFY_AJAX_CALL_FAILURE:
        case types.NOTIFY_AJAX_CALL_SUCCESS: {

            return next(action);
        }
        default: {
            return next(action);
        }
    }
}