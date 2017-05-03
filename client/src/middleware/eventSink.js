// Don't use this unless you need to know an action happened 
// but you don't want to store something in state as a result.
// Usually you just want to use a reducer and update state.



const sink = {};
const middleware = store => next => action => {
    publish(action);
    return next(action);
};

module.exports = {
    subscribe,
    publish,
    middleware
};


function subscribe(action, listener){
    sink[action] = sink[action] || [];
    sink[action].push(listener);
    // return unsubscribe method;
    return ()=>sink[action].splice(sink[action].indexOf(listener), 1);
}
function publish(action){
    if (sink.hasOwnProperty(action.type)) {
        sink[action.type].forEach(listener => listener());
    }
}
