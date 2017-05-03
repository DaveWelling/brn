export function getRecords(namespace, relation, optionalIsDirty=false, optionalSearchTerm='', optionalPageToLoad=1, optionalPageSize=100, optionalSort='', appendResults=false) {
    if (!namespace) throw new Error('"namespace" parameter must be defined when calling getRecords');
    if (!relation) throw new Error('"relation" parameter must be defined when calling getRecords');
    return {
        type: `LOAD_${namespace.toUpperCase()}_${relation.toUpperCase()}`,
        load: {
            namespace,
            relation,
            isDirty: optionalIsDirty,
            searchTerm: optionalSearchTerm,
            page: optionalPageToLoad,
            pageSize: optionalPageSize,
            orderBy: optionalSort,
            appendResults
        }
    };
}

export function getNonPagedRecords(namespace, relation, optionalStartDateTime='', optionalEndDateTime='', optionalPropertyName='', optionalExcludedPropertyValues='', optionalCorrelationId='', optionalGroupBy='', optionalReturnPayLoad=true) {
    if (!namespace) throw new Error('"namespace" parameter must be defined when calling getRecords');
    if (!relation) throw new Error('"relation" parameter must be defined when calling getRecords');
    return {
        type: `NONPAGEDRECORDS_${namespace.toUpperCase()}_${relation.toUpperCase()}`,
        nonpagedrecords: {
            namespace,
            relation,
            startDateTime: optionalStartDateTime,
            endDateTime: optionalEndDateTime,
            propertyName: optionalPropertyName,
            excludedPropertyValues: optionalExcludedPropertyValues,
            correlationId: optionalCorrelationId,
            groupBy: optionalGroupBy,
            returnPayLoad: optionalReturnPayLoad
        }
    };
}