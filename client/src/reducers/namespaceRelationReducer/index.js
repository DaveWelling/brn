import initialState from '../initialState';
import {injectAsyncReducer} from '../../store';
import editReducer from './editReducer';
import newReducer from './newReducer';
import removeSuccessReducer from './removeSuccessReducer';
import nonPagedRecordsSuccessReducer from './nonPagedRecordsSuccessReducer';
import loadSuccessReducer from './loadSuccessReducer';
import submitSuccessReducer from './submitSuccessReducer';

export function createAppReducers(useCase) {
// Inject reducers for each relation in the app config
    useCase.namespaces.forEach(namespace => {
        //createNamespaceReducer(namespace.title, namespace.relations);
        namespace.relations.forEach(relation => {
            // flatten state to make equality comparison less complex.
            // One reducer entry per namespace/relation combination.
            const reducerTitle = namespace.title + '_' + relation.title;
            const namespaceRelation = `${namespace.title.toUpperCase()}_${relation.title.toUpperCase()}`;

            const editActionType = `EDIT_${namespaceRelation}`;
            const editSuccessActionType = `EDIT_${namespaceRelation}_SUCCESS`;
            const newActionType = `NEW_${namespaceRelation}`;
            const loadSuccessActionType = `LOAD_${namespaceRelation}_SUCCESS`;
            const removeSuccessType = `REMOVE_${namespaceRelation}_SUCCESS`;
            const nonPagedRecordsSuccessType = `NONPAGEDRECORDS_${namespaceRelation}_SUCCESS`;
            const submitSuccessActionType = `SUBMIT_${namespaceRelation}_SUCCESS`;


            initialState[reducerTitle] = {
                items: [],
                page: 1,
                page_size: 100,
                order_by: '',
                total_items: 0,
                total_pages: 1,
                search_term: '',
                activeRecord: {},
                isDirty: true,
                isNew: false,
                newRecords: [],
                correlationId: '',
                ...initialState[reducerTitle]
            };

            injectAsyncReducer(reducerTitle, function (state = initialState[reducerTitle], action) {
                switch (action.type) {
                    case editActionType:
                    case editSuccessActionType:
                        return editReducer(state, action);
                    case newActionType:
                        return newReducer(state,action);
                    case removeSuccessType:
                        return removeSuccessReducer(state,action);
                    case loadSuccessActionType:
                        return loadSuccessReducer(state, action);
                    case nonPagedRecordsSuccessType:
                        return nonPagedRecordsSuccessReducer(state, action);
                    case submitSuccessActionType:
                        return submitSuccessReducer(state,action);
                }
                return state;
            });
        });
    });
}
