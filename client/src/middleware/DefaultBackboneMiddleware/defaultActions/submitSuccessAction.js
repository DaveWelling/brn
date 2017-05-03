
import {popScreenNotification} from '../../../actions/notificationActions';
import {toLabel} from '../../../helpers/textHelpers';

export default function submitSuccessAction(store, action, next) {
    if (action.handled) return next(action);
    validateAction(action);

    if (action.type.endsWith('_SUCCESS')){
        store.dispatch(popScreenNotification(
            toLabel(action.submit.relation) + ' saved.'));
    }
    return next(action);
}


function validateAction(action) {
    if (!action.submit) throw new Error('All SUBMIT actions must contain a submit property.');
    if (!action.submit.relation) throw new Error('All SUBMIT actions must contain a submit property with a child relation property for the form being submitted.');
}
