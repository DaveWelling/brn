const repo = require('../../../src/repository');
const url = 'mongodb://localhost:27017/novel';
const mongo = require('mongodb');
const ObjectId = mongo.ObjectId;
const expect = require('expect');
describe('repository', function() {
    let db;
    before(function(done) {
        const cnnc = mongo.MongoClient.connect(url, { db: { bufferMaxEntries: 0 } });
        cnnc.then(newDb => {
            db = newDb;
            done();
        }).catch(done);
    });
    // This is not implemented yet with patches
    it.skip('has a max of X revisions', function(done) {
        repo.init(['test']).then(repos => {
            const target = repos['test'];
            const id = new ObjectId();
            let document = {_id: id, title: 'your mom', number: 0};
            var previousPromise = target.insert(document);
            for (let i = 1; i <= 20; i++) {
                let docClone = Object.assign({}, document);
                previousPromise = doIt(i, docClone, previousPromise, target);
            }
            return previousPromise.then(() => {
                getNumberOfRevisions(id).then(result => {
                    expect(result).toEqual(10);
                    done();
                });
            });
        }).catch(done);
    });


    function doIt(i, document, previousPromise, target) {
        document.number = i;
        return previousPromise.then(result => {
            console.log(JSON.stringify(document));
            return target.update(document);
        });
    }

    function getNumberOfRevisions(id) {
        return db.collection('test').findOne({_id: id}).then(result => {
            return result.revisions.length;
        });
    }
});