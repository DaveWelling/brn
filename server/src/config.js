const mongo = require('mongodb');
let config;
module.exports = {
    start,
    get
};

function start(mongoUrl) {
    const cnnc = mongo.MongoClient.connect(mongoUrl + 'backbone', { db: { bufferMaxEntries: 0 } });
    return cnnc.then(db => {
        const collection = db.collection('useCase');
        return collection.find({ title: 'BRN', deleted: { $exists: false } }, { meta: 0 }).next()
        .then(result => {
            config = result;
        });
    });
}

function get() {
    if (!config) {
        throw new Error('You must execute the start method before using the get method to retrieve your config.');
    }
    return config;
}