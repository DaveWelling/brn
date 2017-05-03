'use strict';
let ObjectId = require('mongodb').ObjectId;

/**
 * Altered from https://github.com/stjosephcontent/jsonpatch-to-mongodb/blob/master/index.js.
 * to better match the spec: https://tools.ietf.org/html/rfc6902#page-4
 * @param patches - json patch array;
 * @param id - mongo object id
 * @param userContext - should be created by route, contains info about this user
 * @returns {{}} - mongodb updates
 */
module.exports = function(patches, id) {
    // Mongo will not allow an update to change an document's path twice
    let pathRequestPatches = getRequestPatchesByPathGroups(patches);
    // get a mongo request for each group of patches
    let requests = [];
    pathRequestPatches.forEach(reqPatch => {
        requests.push(getRequest(reqPatch.patches, id));
    });
    return requests;
};

function getRequestPatchesByPathGroups(patches) {
    let pathRequests = [];
    patches.forEach(patch => {
        let allocated = false;
        let patchPath = patch.path.split('/')[1];
        // if an existing request has not used this patch path,
        // add this patch.
        pathRequests.forEach(req => {
            if (!req.paths.includes(patchPath) || req.op === 'test') {
                req.paths.push(patchPath);
                req.patches.push(patch);
                allocated = true;
            }
        });
        // if no existing requests can accept this patch path,
        // create a new request.
        if (!allocated) {
            if (patch.op === 'test') {
                pathRequests.push({
                    paths: [],
                    patches: [patch]
                });
            } else {
                pathRequests.push({
                    paths: [patchPath],
                    patches: [patch]
                });
            }
        }
    });
    return pathRequests;
}

function getRequest(patches, id) {
    let result = {};
    let update = {};
    update.$pushAll = {};
    update.$pushAll['meta.patches'] = [];
    let currentTime = new Date().toISOString();
    let objectId = id;
    result.filter = { '_id': objectId };

    // Removing leading slash and convert remainder to dots
    let toDot = function(path) {
        return path.replace(/\//g, '.').replace(/^\./, '');
    };

    function setMetaData(p) {
        update.$set['meta.modifiedTime'] = currentTime;
        update.$pushAll['meta.patches'].push({ 'time': currentTime, 'patch': p });
    }

    patches.map(function(p) {
        switch (p.op) {
            case 'add': {
                if (!update.$set) {  // Initialize this operator
                    update.$set = {};
                }
                let lastSegmentOfPath = p.path.substr(p.path.lastIndexOf('/') + 1);
                if (lastSegmentOfPath === '-' || !isNaN(parseInt(lastSegmentOfPath, 10))) {
                    let path = p.path.substr(0, p.path.lastIndexOf('/'));
                    if (!update.$push) {  // Initialize this operator
                        update.$push = {};
                    }
                    if (!update.$push[toDot(path)]) {
                        update.$push[toDot(path)] = { $each: [] };
                    }
                    update.$push[toDot(path)].$each.push(p.value);
                } else {
                    update.$set[toDot(p.path)] = p.value;
                }
                setMetaData(p);
                break;
            }
            case 'remove':
                if (!update.$set) {  // Initialize this operator
                    update.$set = {};
                }
                var id;
                if (p.path.includes('?')) {
                    var query = p.path.substr(p.path.lastIndexOf('?') + 1);
                    var splitQuery = query.split('=');
                    if (!splitQuery[0] === '_id') {
                        throw new Error(`Unsupported query property: ${splitQuery[0]}`);
                    }
                    id = ObjectId(splitQuery[1]);
                }
                if (!id) {
                    // If this is a property, then we are good.
                    // If this is an array index, unfortunately, it will set the corresponding mongo
                    // array index value to null (rather than removing it)
                    // http://stackoverflow.com/questions/4588303/in-mongodb-how-do-you-remove-an-array-element-by-its-index
                    var dotPath = toDot(p.path);
                    if (!update.$unset) {  // Initialize this operator
                        update.$unset = {};
                    }
                    update.$unset[dotPath] = 1;
                } else {
                    // This is an actual Mongo ObjectId and it will allow us to $pull (remove)
                    // the array item entirely
                    if (!update.$pull) {  // Initialize this operator
                        update.$pull = {};
                    }
                    var arrayDotPath = toDot(p.path.substr(0, p.path.lastIndexOf('?')));
                    update.$pull[arrayDotPath] = {'_id': id};
                }
                setMetaData(p);
                break;
            case 'replace':
                if (!update.$set) {  // Initialize this operator
                    update.$set = {};
                }
                update.$set[toDot(p.path)] = p.value;
                setMetaData(p);
                break;
            case 'test':
                result.filter[toDot(p.path)] = p.value;
                break;
            default:
                throw new Error('Unsupported Operation! op = ' + p.op);
        }
    });
    result.updates = update;
    return result;
};