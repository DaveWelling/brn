const repositoryInit = require('../repository').init;
const Boom = require('boom');
const EJSON = require('mongodb-extended-json');
const deserialize = require('../../node_modules/mongodb-extended-json/lib/deserialize');
const config = require('../config').get();

const ObjectId = require('mongodb').ObjectId;
module.exports = {
    register: register
};

register.attributes = {
    name: 'controller'
};

function register(server, options, next) {
    // Add the status route
    server.route({
        method: 'GET',
        path: '/status',
        handler: function(request, reply) {
            return reply('Server up.');
        }
    });
    server.route({
        method: 'GET',
        path: '/backbone/useCase/{appName}',
        handler: function(request, reply) {
            return reply(EJSON.stringify(config)).header('Content-Type', 'application/json');
        }
    });
    config.namespaces.forEach(namespace => {
        namespace.relations.forEach(relation => {
            createRoute(server, namespace, relation);
        });
    });
    next();
}

function createRoute(server, namespace, relation) {
    const routeName = namespace.title + '/' + relation.title;
    server.route({
        method: 'GET',
        path: `/${routeName.toLowerCase()}/{id}`,
        handler: function(request, reply) {
            var id = ObjectId.createFromHexString(request.params.id);
            repositoryInit(namespace, relation).then(repository =>
                repository.get(id).then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    return reply(EJSON.stringify(result)).header('Content-Type', 'application/json');
                }).catch(function(err) {
                    return reply(Boom.badImplementation(err));
                })
            );
        }
    });
    server.route({
        method: 'GET',
        path: `/${routeName.toLowerCase()}`,
        handler: function(request, reply) {
            repositoryInit(namespace, relation).then(repository =>
                repository.getAll().then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    let returnValue = {
                        items: result
                    };
                    return reply(EJSON.stringify(returnValue)).header('Content-Type', 'application/json');
                }).catch(function(err) {
                    return reply(Boom.badImplementation(err));
                })
            );
        }
    });
    server.route({
        method: 'PUT',
        path: `/${routeName.toLowerCase()}`,
        handler: function(request, reply) {
            reply(Boom.methodNotAllowed('Use patch instead.'));
        }
    });
    server.route({
        method: 'POST',
        path: `/${routeName.toLowerCase()}`,
        handler: function(request, reply) {
            const objPayload = deserialize(request.payload);
            repositoryInit(namespace, relation).then(repository =>
                repository.insert(objPayload).then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    return reply(result);
                }).catch(function(err) {
                    return reply(Boom.badImplementation(err));
                })
            );
        }
    });
    server.route({
        method: 'PATCH',
        path: `/${routeName.toLowerCase()}/{id}`,
        handler: function(request, reply) {
            const objPayload = deserialize(request.payload);
            repositoryInit(namespace, relation).then(repository =>
                repository.patch(request.params.id, objPayload).then(result => {
                    if (!result) {
                        return reply(Boom.notFound());
                    }
                    return reply(result);
                }).catch(function(err) {
                    return reply(Boom.badImplementation(err));
                })
            );
        }
    });
}