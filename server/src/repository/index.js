const mongo = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017/';
const patchToMongo = require('./patchToMongo');
const ObjectId = mongo.ObjectId;
const Boom = require('boom');

module.exports = {
    init,
    repository
};

function init(namespace, relation) {
    const url = mongoUrl + namespace.title;
    const cnnc = mongo.MongoClient.connect(url, { db: { bufferMaxEntries: 0 } });
    return cnnc.then(db => repository(db.collection(relation.title)));
}


function repository(collection) {
    const _collection = collection;
    return {
        insert,
        update,
        remove,
        get,
        getAll,
        patch
    };

    function insert(document) {
        return _collection.insert(document);
    }

    function update(document) {
        throw new Error('Updates not supported.  Use patch instead.');
    }

    function patch(stringId, objPayload) {
        const id = ObjectId.createFromHexString(stringId);
        const mongoRequests = patchToMongo(objPayload, id);
        const promises = [];
        mongoRequests.forEach(mongoPatch => {
            promises.push(_collection.updateOne(mongoPatch.filter, mongoPatch.updates).then(result => {
                if (result.matchedCount !== 1 || result.modifiedCount !== 1) {
                    return Boom.conflict('It is likely another person has changed this record before you sent your change.  Refresh the page.');
                }
                return result;
            }));
        });
        return Promise.all(promises);
    }

    function remove(id) {
        return _collection.updateOne({ _id: id }, { $set: { deleted: true } });
    }

    function get(id) {
        return _collection.find({ _id: id, deleted: { $exists: false } }, { meta: 0 }).next();
    }

    function getAll() {
        return _collection.find({ deleted: { $exists: false } }, { meta: 0 }).toArray();
    }
}