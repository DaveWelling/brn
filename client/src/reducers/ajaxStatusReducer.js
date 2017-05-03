import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function ajaxStatusReducer(state = initialState.ajaxStatus, action) {
    // Switch with fall-through causes linting problems.
    if (action.type === types.NOTIFY_AJAX_CALL){
        return Object.assign({}, state, {
            ajaxCallsInProgress: state.ajaxCallsInProgress + 1,
            waitText: action.notify.waitText || ''
        });
    } else {
        if (action.type === types.NOTIFY_AJAX_CALL_FAILURE ||
            action.type === types.NOTIFY_AJAX_CALL_SUCCESS){
            return Object.assign({}, state, {
                ajaxCallsInProgress: state.ajaxCallsInProgress - 1,
                waitText: ''
            });
        }
    }
    return state;
}
