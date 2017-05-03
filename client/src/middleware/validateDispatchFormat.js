
const example = '{type:"VERB_NAMESPACE_RELATION_OPTIONALRESULT", verb: {somedatahere}}';
const validVerbTypes = ['SAVE','LOAD','EDIT','NEW','SEARCH', 'SUBMIT', 'CANCEL', 'CLOSE', 'STARTUP', 'NOTIFY', 'CHANGE', 'REMOVE'];
const validResultTypes = ['FAILURE', 'SUCCESS', 'UNNECESSARY'];

const middleware = store => next => action => {
    verifyFormat(action);
    return next(action);
};

export default middleware;


function verifyFormat(action){
    if (!action.type) log(`No action type for action ${action}`);
    const typeParts = action.type.split('_');
    verifyActionTypeIsUpperCase(action.type);
    verifyActionTypeLength(action.type, typeParts);
    verifyVerb(action, typeParts);
    verifyVerbIsSecondProperty(action, typeParts);
    verifyResultType(action, typeParts);
    verifyFailuresHaveErrors(action, typeParts);
}

function verifyActionTypeIsUpperCase(actionType){
    if (!actionType === actionType.toUpperCase()) {
        log(`By convention (and to avoid weird bugs) the action type needs to be completely uppercase. Currently: ${actionType}`);
    }
}

function verifyFailuresHaveErrors(action, typeParts){
    if (typeParts.length === 4 && typeParts[3] === 'FAILURE') {
        let verb = typeParts[0].toLowerCase();
        if (!action[verb].errors || !Array.isArray(action[verb].errors)) {
            log(`Failure actions such as ${action.type} must contain an errors array in the ${action[verb]} property.`);
        }
    }
}

function verifyActionTypeLength(actionType, typeParts) {
    if (typeParts.length < 3 || typeParts.length > 4){
        log(`The action type should have between 3 and 4 parts.  ${actionType} has ${typeParts.length} parts.`);
    }
}

function verifyResultType(action, typeParts){
    if (typeParts.length === 4) {
        let resultType = typeParts[3];
        if (!validResultTypes.includes(resultType)) {
            log(`The action result type ${resultType} is not valid.  Valid result types are ${validResultTypes}`);
        }
    }
}

function verifyVerbIsSecondProperty(action, typeParts){
    let verb = typeParts[0].toLowerCase();
    if (Object.keys(action).length > 1 && !action[verb]){
        log(`The action verb ${verb} is not the second property of the dispatch message: ${JSON.stringify(action)}`);
    }
}

function verifyVerb(action, typeParts){
    
    if (!validVerbTypes.includes(typeParts[0])){
        log(`${typeParts[0]} is not a valid verb.  Valid verbs are: ${validVerbTypes}`);
    }
}

function log(message){
    console.error(message);
    console.warn(`The dispatch message (aka action) should look like this: ${example}`);
    debugger;
    throw new Error(message);
}