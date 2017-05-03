import gpp from '../api/generalPurposePersistence';
import * as types from './actionTypes';
import * as ajax from './ajaxStatusActions';
import {createAppReducers} from '../reducers/namespaceRelationReducer';

export function loadUseCaseSuccess(useCase) {
	return { type: types.LOAD_BACKBONE_USECASE_SUCCESS, load: {items:[useCase], activeRecord:useCase}};
}

export function loadUseCaseFailure(error){
	return {type: types.LOAD_BACKBONE_USECASE_FAILURE, load: {errors: [error]}};
}

export function loadUseCase(appName) {
	return function (dispatch, getState) {

		dispatch(ajax.beginAjaxCall('Loading Configuration'));

        const url = '/api/backbone/useCase/' + appName;
		return gpp.getAll(url).then(useCase =>{
			createAppReducers(useCase);
			dispatch(loadUseCaseSuccess(useCase));
			dispatch(ajax.endAjaxCall());
		}).catch(error => {
			dispatch(loadUseCaseFailure(error));
			dispatch(ajax.ajaxCallError(error));
			throw(error);
		});
	};
}
