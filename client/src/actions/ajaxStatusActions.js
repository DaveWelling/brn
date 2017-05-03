import * as types from './actionTypes';

export function beginAjaxCall(waitText) {
  return {type: types.NOTIFY_AJAX_CALL, notify: {waitText}};
}

export function ajaxCallError(optionalError) {
  return {type: types.NOTIFY_AJAX_CALL_FAILURE, notify: {errors: [optionalError || 'No error specified'], skipLogging: true}};
}

export function endAjaxCall(optionalResult) {
  return {type: types.NOTIFY_AJAX_CALL_SUCCESS, notify: {result: [optionalResult || 'No result specified']}};
}
