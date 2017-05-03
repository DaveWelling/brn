import {combineReducers} from 'redux';
import ajaxStatus from './ajaxStatusReducer';
import backbone_useCase from './useCaseReducer';
import search from './searchReducer';

export default function createReducer(asyncReducers) {
    //noinspection Eslint
    return combineReducers({
        ajaxStatus,
        backbone_useCase,
        search,
        ...asyncReducers
    });
}
