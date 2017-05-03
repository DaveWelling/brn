import * as actionTypes from './actionTypes';

export function popScreenNotification(message, optionalTimeout, optionalActionHandler, optionalActionText){
    return function(dispatch){
        dispatch({type: actionTypes.NOTIFY_APPLICATION_USER, notify: {
            message,
            actionHandler: optionalActionHandler,
            actionText: optionalActionText,
            timeout: optionalTimeout || 5000
        }});
    };
}