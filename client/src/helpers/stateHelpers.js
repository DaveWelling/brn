import _ from 'lodash';

export function getDataByAction (state, action) {
    let data = undefined;

    if (!state.search || !state.search[action]) {
        return data;
    }

    

    return state.search[action].searchText;
}
