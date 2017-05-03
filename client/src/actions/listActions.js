import {getRecords} from './generalPurposePersistenceActions';

export function reorderList (namespace, relation, orderBy, direction) {
    return (dispatch, getState) => {
        const state = getState();
        let statePath = `${namespace}_${relation}`;
        const criteria = state[statePath];
        if (direction === 'ascending') {
            dispatch(getRecords(namespace, relation, false, criteria.searchTerm, criteria.page, criteria.pageSize, `${orderBy}:a`));
        }
        else {
            dispatch(getRecords(namespace, relation, false, criteria.searchTerm, criteria.page, criteria.pageSize, orderBy));
        }
    };
}
