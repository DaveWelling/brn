import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function useCaseReducer(state = initialState.backbone_useCase, action) {
	switch (action.type) {
		case types.LOAD_BACKBONE_USECASE_SUCCESS:
            if (state.loadingUseCase) {
                return Object.assign({}, state, {loadingUseCase: false}, action.load);
            } else {
                return state;
            }
        case types.LOAD_BACKBONE_USECASE_FAILURE:
            return Object.assign({}, {loadingUseCase: true}, action.load);
		default:
			return state;
	}
}
