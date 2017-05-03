import log, * as logType from '../helpers/loggingHelper';

const middleware = store => next => action => {
    logFailures(action);
    return next(action);
};

export default middleware;

function logFailures(action){
    if (action.type.endsWith('_FAILURE')) {
        let typeParts = action.type.split('_');
        let data = action[typeParts[0].toLowerCase()];
        if (data.skipLogging) return; // some failures might be redundant to log (like ajax notifications).
        typeParts.pop(); // remove failure string
        let originalAction = typeParts.join('_'); // put back together.
        data.errors.forEach(error=>{
            if (error instanceof Error) {
                log(`Action ${originalAction} failed. ${error.message} Error stack: ${error.stack}`, logType.ERROR);
            } else if (typeof error === 'string') {                
                log(`Action ${originalAction} failed. ${error}`, logType.ERROR);
            } else {
                log(`Action ${originalAction} failed. ${JSON.stringify(error)}`, logType.ERROR);
            }
        });
    }
}