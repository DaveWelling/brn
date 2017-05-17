const mongo = require('mongodb');
const config = require('../config');
const patchToMongo = require('./patchToMongo');
const ObjectId = mongo.ObjectId;
const Boom = require('boom');

module.exports = {
    init,
    repository
};

function init(namespace, relation) {
    const url = config.mongoUrl + namespace.title;
    const cnnc = mongo.MongoClient.connect(url, {db: {bufferMaxEntries: 0}});
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
        getByTitle,
        patch
    };

    function insert(document) {
        if (typeof document._id !== 'object') {
            document._id = ObjectId.createFromHexString(document._id);
        }
        return _collection.insertOne(document);
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
        if (typeof id !== 'object') {
            id = ObjectId.createFromHexString(id);
        }
        return _collection.deleteOne({_id: id});
        // return _collection.updateOne({ _id: id }, { $set: { deleted: true } });
    }

    function get(id) {
        return _collection.find({ _id: id, deleted: { $exists: false } }, { meta: 0 }).next();
    }

    function getAll() {
        return _collection.find({ deleted: { $exists: false } }, { meta: 0 }).toArray();
    }
    function getByTitle(title) {
        if (!title) {
            throw new Error('A title is required for this get operation.');
        }
        let query = {
            'title': title,
            'meta.deleted': {
                $exists: false
            }
        };
        return _collection
                .find(
                    query, {
                        'meta': 0,
                        'originalContent': 0
                    }).next();
    }
}