import {applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {defaultBackboneMiddleware} from '../middleware/DefaultBackboneMiddleware';
const eventSink = require('../middleware/eventSink').middleware;
import validateDispatchFormat from '../middleware/validateDispatchFormat';
import failureLogging from '../middleware/failureLogging';


export default compose(
    // Ignore useCase for invariance because it is too big and will crash.
    // Deep trees in useCase metadata cause reduxImmutable... to hang or crash
    // reduxImmutableStateInvariant({ignore:['useCase', 'routes']}),
    applyMiddleware(thunk, validateDispatchFormat, defaultBackboneMiddleware, eventSink, failureLogging)
);
