import {applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {defaultBackboneMiddleware} from '../middleware/DefaultBackboneMiddleware';
export default applyMiddleware(thunk, defaultBackboneMiddleware);

