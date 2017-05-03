export function columnContainsText(column) {
    if (!column) {
        return false;
    }
    return (!column.dataType ||
            column.dataType === 'text' ||
            column.dataType === 'localVerboseDateTime' ||
            column.dataType === 'boolean'
           );
}

export function getSort(orderBy, direction) {
    if (!direction || direction === 'descending')
        return orderBy;

    return orderBy + ':a';
}


export function toggleDirection(orderByColumn, orderBy, direction) {
    if (orderByColumn === orderBy && direction === 'descending') {
        return 'ascending';
    }
    return 'descending';
}

export function appendResultToNewRecords(newRecords, result) {
    const results = [];
    if (result && result.ops) {
        results.push(result.ops[0]);
    }
    else if (result && !result.result) {
        results.push(result);
    }
    return results.concat(newRecords);
}

export function updateListItemWithResult(items, result) {
    const resultId = result._id ? result._id.toString() : result.title;
    return items.map((item) => {
        const itemId = item._id ? item._id.toString() : item.title;
        if (itemId === resultId) {
            return result;
        }
        return item;
    });
}

export function getValueFromState(state, namespace, relation, valueName, defaultValue) {
    let statePath = `${namespace}_${relation}`;
    if (state[statePath] &&
        state[statePath][valueName]) {
        return state[statePath][valueName];
    }
    return defaultValue;
}

export function getIsDirty(state, namespace, relation) {
    let statePath = `${namespace}_${relation}`;
    if (state[statePath]) {
        return state[statePath]['isDirty'];
    } else {
        return true;
    }
}

export function filterByParentRecord(filterInfo, state) {
    let parentRecord = getParentRecord(filterInfo.parentNamespace, filterInfo.parentRelation, state);
    if(parentRecord) {
        return buildIdPropertySearchTerm(parentRecord._id);
    } else {
        return null;
    }
}

//Privates
function buildIdPropertySearchTerm(idValue) {
    return `$oid:${idValue}`;
}

function getParentRecord(parentNamespace, parentRelation, state) {
    let parentRecord;
    if(parentRelation && parentNamespace) {
        parentRecord = getValueFromState(state, parentNamespace, parentRelation, 'activeRecord', null);
    }
    return parentRecord || null;
}
