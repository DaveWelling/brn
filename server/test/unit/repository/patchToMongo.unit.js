const getPatch = require('../../jsondiffpatch');
const getMongoFromPatch = require('../../../src/repository/patchToMongo');
const mongo = require('mongodb');
const ObjectId = mongo.ObjectId;
const expect = require('expect');

describe('splitPatchIfNecessary', function() {
    describe('More than one operation on same array', function() {
        it('splits patch into two operations', function() {
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
            const patch = getPatch.compare(startObj, changeObj);
            const result = getMongoFromPatch(patch, 1);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });
    });
});