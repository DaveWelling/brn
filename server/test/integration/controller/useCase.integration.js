const expect = require('expect');
const mongodb = require('mongodb');
const ObjectId = require('mongodb-core').BSON.ObjectId;
const repository  = require('../../../src/repository');
const config = require('../../../src/config');
const startProxyServer = require('./serverProxy');

describe('useCaseController', function() {
    this.timeout(10000);

    let overrideConfig = {
        configNamespace: 'test'
    };
    before(function(){
        config.setOverrides(overrideConfig);
    });

    after(function(done){
        dropDatabase().then(()=>done()).catch(done);
    });

    function dropDatabase() {
        const url = config.mongoUrl + config.configNamespace;
        const cnnc = mongodb.MongoClient.connect(url, { db: { bufferMaxEntries: 0 } });
        return cnnc.then(db => db.dropDatabase(
            function(err) {
                if (err) throw err;
                db.close();
            }
        ));
    }

    describe('post', function(){
        let server;
        beforeEach(function(done){
            startProxyServer(true, overrideConfig).then(function(result){
                server = result;
            }).then(() => done()).catch(done);
        });
        afterEach(function(done){
            dropDatabase().then(done).catch(done);
        });
        describe('a document does not exist already for the use case', function(){
            it('inserts a new config', function(done){
                const testId = new ObjectId().toString();
                server.inject({
                    method: 'post',
                    url: `/api/${config.configNamespace}/${config.configRelation}`,
                    payload: JSON.stringify({
                        _id: {'$oid': testId},
                        title: 'testOMatic',
                        namespaces: [{title: 'mysteriousNamespace'}]
                    })
                }).then(function(response){
                    expect(response.statusCode).toBe(201);
                    expect(response.result._id).toBe(testId);
                    done();
                }).catch(done);
            })
        });
    });

    describe('get', function(){
        let server;
        beforeEach(function(done){
            // Insert a new useCase configuration
            // and create a server to get it.
            repository.init({title: config.configNamespace}, {title:config.configRelation}).then(db =>
                db.insert({
                    _id: new ObjectId(),
                    namespaces: [],
                    title: config.useCaseName
                })
            ).then(()=>{
                return startProxyServer(true, overrideConfig).then(function(result){
                    server = result;
                })
            }).then(() => done()).catch(done);
        });
        afterEach(function(done){
            dropDatabase().then(done).catch(done);
        });
        describe('a current config exists for the useCase', function(){

            it('should retrieve current use case config', function(done){
                server.inject({
                    method: 'get',
                    url: `/api/${config.configNamespace}/${config.configRelation}/${config.useCaseName}`
                }).then(function(response){
                    expect(response.statusCode).toBe(200);
                    expect(JSON.parse(response.result).title).toBe(config.useCaseName);
                    done();
                }).catch(done);
            });
        });
    });
});