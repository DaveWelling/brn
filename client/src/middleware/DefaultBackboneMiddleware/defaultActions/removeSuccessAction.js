
import {popScreenNotification} from '../../../actions/notificationActions';
import {toLabel} from '../../../helpers/textHelpers';

export default function removeSuccessAction(store, action, next) {
    if (action.handled) return next(action);

    if (action.type.endsWith('_SUCCESS')){
        store.dispatch(popScreenNotification(
            toLabel(action.hNode.relation) + ' removed.'));
    }
    return next(action);
}



