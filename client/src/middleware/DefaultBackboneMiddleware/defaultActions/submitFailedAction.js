
import {popScreenNotification} from '../../../actions/notificationActions';
import {toLabel} from '../../../helpers/textHelpers';

export default function submitFailedAction(store, action, next) {
    if (action.handled) return next(action);
    validateAction(action);

    if (action.type.endsWith('_FAILURE')){
        store.dispatch(popScreenNotification(
            toLabel(action.submit.relation) + ' could not be saved.'));
    }
    return next(action);
}


function validateAction(action) {
    if (!action.submit.relation) throw new Error('All SUBMIT actions must contain a submit property with a child relation property for the form being submitted.');
}
