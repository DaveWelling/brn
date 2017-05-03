
import {popScreenNotification} from '../../../actions/notificationActions';
import {toLabel} from '../../../helpers/textHelpers';

export default function removeFailedAction(store, action, next) {
    if (action.handled) return next(action);

    if (action.type.endsWith('_FAILURE')){
        store.dispatch(popScreenNotification(
            toLabel(action.remove.relation) + ' could not be removed.'));
    }
    return next(action);
}



