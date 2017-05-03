const getPatch = require('../../jsondiffpatch');
const mongo = require('mongodb');
const ObjectId = mongo.ObjectId;
const expect = require('expect');
const repositoryInit = require('../../../src/repository').init;

describe('splitPatchIfNecessary', function() {
    let repos = [];
    before(function(done) {
        const entities = ['testJunk'];
        repositoryInit(entities).then((repositories) => {
            repos = repositories;
            done();
        }).catch(done);
    });
    describe('More than one operation on same array', function() {
        it('splits patch into two operations', function(done) {
            const id = new ObjectId();
            const startObj = {
                _id: id,
                locations: [
                    {
                        title: 'l1',
                        children: [
                            {
                                title: 'l1c1',
                                children: []
                            },
                            {
                                title: 'l1c2',
                                children: []
                            }
                        ]
                    }
                ]
            };
            const changeObj = {
                _id: id,
                locations: [
                    {
                        title: 'l1',
                        children: [
                            {
                                title: 'l1c1',
                                children: []
                            }
                        ]
                    },
                    {
                        title: 'l1c2',
                        children: []
                    }
                ]
            };
            const patch = getPatch.compare(startObj, changeObj, true);
            repos['testJunk'].insert(startObj).then(insertResult => {
                return repos['testJunk'].patch(id.toHexString(), patch).then(patchResult => {
                    expect(Array.isArray(patchResult)).toBe(true);
                    expect(patchResult.length).toBe(2);
                    patchResult.forEach(result => {
                        expect(result.matchedCount).toBe(1);
                        expect(result.modifiedCount).toBe(1);
                    });
                    done();
                });
            }).catch(done);
        });
    });
});