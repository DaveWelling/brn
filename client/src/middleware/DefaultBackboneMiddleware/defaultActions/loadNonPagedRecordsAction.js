import persistence, { getUrlForRelation } from '../../../api/generalPurposePersistence';
import {beginAjaxCall, ajaxCallError, endAjaxCall} from '../../../actions/ajaxStatusActions';
import { getDefaultDateTimeRange, convertDateToStartDateTime, convertDateToEndDateTime } from '../../../helpers/dateTimeHelpers';

export default function loadNonPagedRecordsAction(store, action, next) {
    if (action.type.endsWith('_SUCCESS') ||
        action.type.endsWith('_FAILURE') ||
        action.type.endsWith('_UNNECESSARY')) {
        return next(action);
    }

    const requestedCriteria = getRequestCriteria(store, action.nonpagedrecords);
    const baseRelationUrl = getUrlForRelation(action.nonpagedrecords.namespace, action.nonpagedrecords.relation);

    const url = getQueryUrl(baseRelationUrl + '/nonpaged', requestedCriteria);
    store.dispatch(beginAjaxCall('Loading Data'));
    persistence.getAll(url).then(result => {
        const nonpagedrecords = Object.assign({}, result);

        store.dispatch({ type: action.type + '_SUCCESS', nonpagedrecords: nonpagedrecords});
        store.dispatch(endAjaxCall());
    }).catch(error => {
        store.dispatch({ type: action.type + '_FAILURE', error });
        store.dispatch(ajaxCallError());
    });
    return next(action);
}

export function getQueryUrl (baseRelationUrl, requestCriteria) {
    if (!requestCriteria) {
        return baseRelationUrl;
    }
    return addQueryParameters(baseRelationUrl, requestCriteria);
}

function addQueryParameters (url, {propertyName, startDateTime, endDateTime, excludedPropertyValues, correlationId, groupBy, returnPayLoad}) {
    const pr = propertyName ? encodeURIComponent(propertyName) : '';
    const st = startDateTime ? encodeURIComponent(startDateTime) : '';
    const et = endDateTime ? encodeURIComponent(endDateTime) : '';
    const ex = excludedPropertyValues ? encodeURIComponent(excludedPropertyValues) : '';
    const co = correlationId ? encodeURIComponent(correlationId) : '';
    const gr = groupBy ? encodeURIComponent(groupBy) : '';
    const rp = returnPayLoad ? encodeURIComponent(returnPayLoad) : '';
    return `${url}?propertyName=${pr}&startDateTime=${st}&endDateTime=${et}&excludedPropertyValues=${ex}&groupBy=${gr}&correlationId=${co}&returnPayLoad=${rp}`;
}

function getRequestCriteria(store, nonpagedrecords){
    // prefer explicit date filters, then state filter data, then defaults
    if (!nonpagedrecords.startDateTime && !nonpagedrecords.endDateTime) {
        let state = store.getState();
        let filterData = state.filterData;
        if(nonpagedrecords.namespace === filterData.namespace &&
           nonpagedrecords.relation === filterData.relation) {
            if (filterData && filterData.startDate && filterData.endDate) {
                nonpagedrecords.startDateTime = convertDateToStartDateTime(filterData.startDate);
                nonpagedrecords.endDateTime = convertDateToEndDateTime(filterData.endDate);
            } else {
                let defaultRange = getDefaultDateTimeRange();
                nonpagedrecords.startDateTime = defaultRange.startDateTime;
                nonpagedrecords.endDateTime = defaultRange.endDateTime;
            }
        }
    }
    nonpagedrecords.returnPayLoad = nonpagedrecords.returnPayLoad || true;
    return nonpagedrecords;
}
