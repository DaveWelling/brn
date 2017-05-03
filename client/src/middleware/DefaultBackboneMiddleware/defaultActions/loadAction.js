import persistence, { getUrlForRelation } from '../../../api/generalPurposePersistence';
import {beginAjaxCall, ajaxCallError, endAjaxCall} from '../../../actions/ajaxStatusActions';

export default function loadAction(store, action, next) {
    if (action.type.endsWith('_SUCCESS') ||
        action.type.endsWith('_FAILURE') ||
        action.type.endsWith('_UNNECESSARY')) {
        return next(action);
    }
    const requestedCriteria = action.load;
    const currentCriteria = getCurrentCriteria(store.getState(), action.load.namespace, action.load.relation);
    if (isLoadNecessary(currentCriteria, requestedCriteria)) {
        const baseRelationUrl = getUrlForRelation(action.load.namespace, action.load.relation);
        const url = getQueryUrl(baseRelationUrl, requestedCriteria);
        store.dispatch(beginAjaxCall('Loading Data'));
        persistence.getAll(url).then(result => {
            const load = Object.assign({}, result, {appendResults: action.load.appendResults});
            store.dispatch({ type: action.type + '_SUCCESS', load: load});
            store.dispatch(endAjaxCall());
        }).catch(error => {
            store.dispatch(ajaxCallError());
            store.dispatch({ type: action.type + '_FAILURE', load: {...action.load, errors:[error], warnings:[]}});
        });
    } else {
        let storeCurrentState = store.getState(action.type);
        store.dispatch({ type: action.type + '_UNNECESSARY', load: {...storeCurrentState, errors:[], warnings:[] }});
    }
    return next(action);
}

export function getQueryUrl (baseRelationUrl, requestCriteria) {
    if (!requestCriteria) {
        return baseRelationUrl;
    }
    return addQueryParameters(baseRelationUrl, requestCriteria);
}

function addQueryParameters (url, {pageSize, page, searchTerm, orderBy}) {
    const ps = encodeURIComponent(pageSize);
    const pg = encodeURIComponent(page);
    const st = encodeURIComponent(searchTerm);
    const ob = encodeURIComponent(orderBy);
    return `${url}?pageSize=${ps}&page=${pg}&searchTerm=${st}&orderBy=${ob}`;
}

export function isLoadNecessary(currentCriteria, requestedCriteria) {
    if (!currentCriteria) return true;
    return (
        requestedCriteria.isDirty ||
            currentCriteria.page !== requestedCriteria.page ||
            currentCriteria.page_size !== requestedCriteria.pageSize ||
            currentCriteria.search_term !== requestedCriteria.searchTerm ||
            currentCriteria.order_by !== requestedCriteria.orderBy ||
            currentCriteria.items.length === 0
    );
}

function getCurrentCriteria (state, namespace, relation) {
    let statePath = `${namespace}_${relation}`;
    if (!state[statePath]) return null;
    return state[statePath];
}
