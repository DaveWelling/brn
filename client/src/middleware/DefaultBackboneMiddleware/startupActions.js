import {loadUseCase} from '../../actions/useCaseActions';

export default function startupActions(store,action,next){
    // Get metadata used for rendering
    store.dispatch(loadUseCase(action.startup.appName));


    return next(action);
}

