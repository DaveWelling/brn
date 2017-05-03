import initialState from './initialState';

export default function searchReducer(state = initialState.search, action) {
    if (action.type.startsWith('SEARCH_')){
        if (state[action.type] !== action.search){
            // merge in new state
            let thisSearch = {};
            thisSearch[action.type] = {...state[action.type], ...action.search};
            return {...state, ...thisSearch};
        }
        return state;
    }    
    return state;
}
