import {createStore} from 'redux';
import createReducer from '../reducers';
let store;
export default getStore;

function getStore(){
    if (!store) {
        throw new Error('Run configureStore before calling getStore.');
    }
    return store;
}

export function configureStore(initialState) {
    let middleware;

    if (process.env.NODE_ENV === 'production') {
        middleware = require('./configureStore.prod');
    } else {
        middleware = require('./configureStore.dev');
    }
    

    let newStore = createStore(
        createReducer(),
        initialState,
        middleware.default
    );
    newStore.asyncReducers = {};

    store = newStore;
}




export function injectAsyncReducer(name, asyncReducer) {
    if (!store.asyncReducers[name]) {
        store.asyncReducers[name] = asyncReducer;
        store.replaceReducer(createReducer(store.asyncReducers));
    }
}