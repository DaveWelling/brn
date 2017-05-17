
const repositoryInit = require('../repository').init;
const useCaseConfigs = require('../useCaseConfigs');
const Boom = require('boom');
const EJSON = require('mongodb-extended-json');
const deserialize = require('../../node_modules/mongodb-extended-json/lib/deserialize');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    add
};

function add(server) {

    server.route({
        method: 'PUT',
        path: '/{useCaseName}/{namespaceTitle}/{relationTitle}/{id}',
        handler: function (request, reply) {
            reply(Boom.methodNotAllowed('Use patch instead.'));
        }
    });
    server.route({
        method: 'PATCH',
        path: '/{useCaseName}/{namespaceTitle}/{relationTitle}/{id}',
        handler: function (request, reply) {
            const objPayload = deserialize(request.payload);
            getRepository(request.params).then(repository=>{
                repository.patch(request.params.id, objPayload).then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    return reply(result);
                }).catch(function (err) {
                    return reply(Boom.badImplementation(err));
                })
            });
        }
    });
    server.route({
        method: 'POST',
        path: '/{useCaseName}/{namespaceTitle}/{relationTitle}',
        handler: function (request, reply) {
            const objPayload = deserialize(request.payload);
            getRepository(request.params).then(repository=>{
                repository.insert(objPayload).then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    return reply(result);
                }).catch(function (err) {
                    return reply(Boom.badImplementation(err));
                })
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/{useCaseName}/{namespaceTitle}/{relationTitle}/{id}',
        handler: function (request, reply) {
            let id = ObjectId.createFromHexString(request.params.id);
            getRepository(request.params).then(repository=>{
                repository.get(id).then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    return reply(EJSON.stringify(result)).header('Content-Type', 'application/json');
                }).catch(function (err) {
                    return reply(Boom.badImplementation(err));
                })
            });
        }
    });
    server.route({
        method: 'GET',
        path: '/{useCaseName}/{namespaceTitle}/{relationTitle}',
        handler: function(request, reply) {
            getRepository(request.params).then(repository=>{
                repository.getAll().then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    let returnValue = {
                        items: result
                    };
                    return reply(EJSON.stringify(returnValue)).header('Content-Type', 'application/json');
                }).catch(function (err) {
                    return reply(Boom.badImplementation(err));
                })
            });
        }
    });

    function getRepository(params) {
        const {useCaseName, namespaceTitle, relationTitle} = params;
        return useCaseConfigs.get(useCaseName).then(config => {
            const namespace = config.namespaces.find(ns=> ns.title === namespaceTitle);
            if (!namespace) throw new Error(`Unknown namespace ${namespaceTitle}`);
            const relation = namespace.relations.find(rel=> rel.title === relationTitle);
            if (!relation) throw new Error(`Unknown relation ${relationTitle}`);
            return repositoryInit(namespace, relation);
        });
    }
    
    
}