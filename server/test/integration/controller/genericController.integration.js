const expect = require('expect');
const mongodb = require('mongodb');
const ObjectId = require('mongodb-core').BSON.ObjectId;
const repository = require('../../../src/repository');
const config = require('../../../src/config');
const startProxyServer = require('./serverProxy');

describe('genericController', function () {
    this.timeout(10000);

    let overrideConfig = {
        configNamespace: 'test'
    };
    const testUseCase = 'mysteriousUseCase';
    const testNamespace = 'mysteriousNamespace';
    const testRelation = 'mysteriousRelation';
    before(function (done) {
        config.setOverrides(overrideConfig);
        insertUseCase().then(()=>done()).catch(done);
    });

    after(function (done) {
        dropDatabase(config.configNamespace).
        then(()=>dropDatabase(testNamespace)).
        then(() => done()).catch(done);
    });

    function dropDatabase(database) {
        const url = config.mongoUrl + database;
        const cnnc = mongodb.MongoClient.connect(url, {db: {bufferMaxEntries: 0}});
        return cnnc.then(db => db.dropDatabase(
            function (err) {
                if (err) throw err;
                db.close();
            }
        ));
    }

    function insertUseCase() {
        return startProxyServer(true, overrideConfig).then(function (result) {
            let server = result;
            const testId = new ObjectId().toString();
            return server.inject({
                method: 'post',
                url: `/api/${config.configNamespace}/${config.configRelation}`,
                payload: JSON.stringify({
                    _id: {'$oid': testId},
                    title: testUseCase,
                    namespaces: [
                        {
                            title: testNamespace,
                            relations: [
                                {
                                    title: testRelation
                                }
                            ]
                        }
                    ]
                })
            })
        })

    }

    describe.skip('post', function () {
        let server;
        beforeEach(function (done) {
            startProxyServer(true, overrideConfig).then(function (result) {
                server = result;
            }).then(() => done()).catch(done);
        });
        afterEach(function (done) {
            dropDatabase().then(done).catch(done);
        });
        describe('a document does not exist already for the use case', function () {
            it('inserts a new config', function (done) {
                const testId = new ObjectId().toString();
                server.inject({
                    method: 'post',
                    url: `/api/${config.configNamespace}/${config.configRelation}`,
                    payload: JSON.stringify({
                        _id: {'$oid': testId},
                        title: 'testOMatic',
                        namespaces: [{title: 'mysteriousNamespace'}]
                    })
                }).then(function (response) {
                    expect(response.statusCode).toBe(201);
                    expect(response.result._id).toBe(testId);
                    done();
                }).catch(done);
            })
        });
    });

    describe('get', function () {
        let server;
        let testThing = 'testThing';
        let insertedId = new ObjectId();
        before(function (done) {
            // Insert a new useCase configuration
            // and create a server to get it.
            repository.init({title: testNamespace}, {title: testRelation}).then(db =>
                db.insert({
                    _id: insertedId,
                    title: testThing
                })
            ).then(() => {
                return startProxyServer(true, overrideConfig).then(function (result) {
                    server = result;
                })
            }).then(() => done()).catch(done);
        });
        afterEach(function (done) {
            dropDatabase().then(done).catch(done);
        });
        describe('an item exists for the configured namespace and relation', function () {

            it('get (with no id) should retrieve the item in an array', function (done) {
                server.inject({
                    method: 'get',
                    url: `/api/${testUseCase}/${testNamespace}/${testRelation}`
                }).then(function (response) {
                    expect(response.statusCode).toBe(200);
                    let results = JSON.parse(response.result);
                    expect(results.items.length).toBe(1);
                    expect(results.items[0].title).toBe(testThing);
                    done();
                }).catch(done);
            });
            it('get (with an id) should retrieve the item', function (done) {
                server.inject({
                    method: 'get',
                    url: `/api/${testUseCase}/${testNamespace}/${testRelation}/${insertedId}`
                }).then(function (response) {
                    expect(response.statusCode).toBe(200);
                    let results = JSON.parse(response.result);
                    expect(results.title).toBe(testThing);
                    done();
                }).catch(done);
            });
        });
    });
});