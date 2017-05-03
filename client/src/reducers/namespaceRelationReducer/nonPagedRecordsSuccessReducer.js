export default function nonPagedRecordsSuccessReducer(state, action) {
    return {
        ...state,
        ...action.nonpagedrecords,
    };
}

