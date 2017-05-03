export default function newReducer(state, action) {
    // merge with existing state.
    return {...state, isNew: true, activeRecord: {}};
}
